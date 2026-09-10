"""Validate the published collection without GPU or third-party dependencies."""
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'assets/models/manifest.json').read_text())

def glb(path):
    data = path.read_bytes()
    magic, version, length = struct.unpack_from('<4sII', data)
    assert magic == b'glTF' and version == 2 and length == len(data), path
    size, kind = struct.unpack_from('<II', data, 12)
    assert kind == 0x4E4F534A, path
    doc = json.loads(data[20:20 + size])
    faces = sum(doc['accessors'][p['indices']]['count'] // 3
                for m in doc['meshes'] for p in m['primitives'])
    return doc, faces

for asset in manifest['assets']:
    path = ROOT / asset['glb']
    doc, faces = glb(path)
    assert faces == asset['faces'], (asset['id'], faces, asset['faces'])
    assert len(doc['meshes']) == asset['parts'], asset['id']
    assert (ROOT / asset['input']).is_file(), asset['input']
    assert (ROOT / 'assets/images' / (asset['id'] + '-preview.jpg')).is_file()
    assert 'KHR_draco_mesh_compression' in doc['extensionsRequired']
    assert path.stat().st_size < 100_000_000
    print(f"{asset['id']}: {asset['parts']} parts, {faces:,} triangles, {path.stat().st_size / 1e6:.2f} MB")

_, whole = glb(ROOT / 'assets/models/results/truck-volumes.glb')
_, a = glb(ROOT / 'assets/models/results/truck-a.glb')
_, b = glb(ROOT / 'assets/models/results/truck-b.glb')
_, parts = glb(ROOT / 'assets/models/results/truck.glb')
assert a + b == whole == parts, 'Volume views must retain the same complete geometry.'
print(f'PASS: {len(manifest["assets"])} assets; A + B and parts have identical triangle counts.')
