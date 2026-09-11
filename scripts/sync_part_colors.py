"""Apply paper colors without decoding or changing any GLB geometry buffers."""
import argparse, copy, hashlib, json, re, struct
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
# qfig_jobs.jsonl: part_colors_linear=true, roughness=.9, studio exposure=.92.
PAPER_HEX = '1F78B5 FF800D 2BA12B D62629 9466BD 8C574A E378C2 737373 BDBD21 17BFCF ADC7E8 FFBA78 4C4CE6 991A66 33CC66 F24C26 66C2A6 FC8C61 8CA1CC E88AC2 A6D954 FFD92E E6C494 B2B2B2'.split()
# Gently reduce chroma at constant linear luminance, shared by both viewers.
CHROMA = 0.85
PALETTE = []
for h in PAPER_HEX:
    rgb = [int(h[i:i+2],16)/255 for i in (0,2,4)]
    luminance = sum(c*w for c,w in zip(rgb,(.2126,.7152,.0722)))
    PALETTE.append([luminance + CHROMA*(c-luminance) for c in rgb]+[1.0])
def recolor(source, destination):
    raw=source.read_bytes();size,kind=struct.unpack_from('<II',raw,12)
    assert kind==0x4e4f534a
    doc=json.loads(raw[20:20+size]);tail=raw[20+size:]
    geometry=copy.deepcopy({k:doc[k] for k in ('meshes','accessors','bufferViews','buffers')})
    assigned={}
    for node in doc['nodes']:
        if 'mesh' not in node:continue
        if source.stem.startswith('method-'):
            index=1 if node.get('extras',{}).get('volume')==1 else 0
        else:
            match=re.fullmatch(r'Part[ _](\d+)',node.get('name',''))
            assert match,(source,node.get('name'))
            index=(int(match[1])-1)%len(PALETTE)
        for prim in doc['meshes'][node['mesh']]['primitives']:
            slot=prim['material'];assert slot not in assigned or assigned[slot]==index
            assigned[slot]=index
            mat=doc['materials'][slot]['pbrMetallicRoughness']
            mat.update(baseColorFactor=PALETTE[index],roughnessFactor=.9,metallicFactor=0.0)
    assert geometry=={k:doc[k] for k in geometry}
    payload=json.dumps(doc,separators=(',',':')).encode();payload+=b' '*((-len(payload))%4)
    output=struct.pack('<4sII',b'glTF',2,20+len(payload)+len(tail))+struct.pack('<II',len(payload),kind)+payload+tail
    destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(output)
    assert output[20+len(payload):]==tail
    return {'file':destination.name,'geometry_sha256':hashlib.sha256(tail).hexdigest(),'materials':len(assigned)}
if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--preview-source',type=Path);ap.add_argument('--preview-output',type=Path);args=ap.parse_args()
    manifest=json.loads((ROOT/'assets/models/manifest.json').read_text());report=[]
    for a in manifest['assets']:
        p=ROOT/a['glb'];report.append(recolor(p,p))
        if args.preview_source:recolor(args.preview_source/(a['id']+'.glb'),args.preview_output/(a['id']+'.glb'))
    for p in (ROOT/'assets/models/results').glob('method-*.glb'):report.append(recolor(p,p))
    print(json.dumps(report,indent=2))
