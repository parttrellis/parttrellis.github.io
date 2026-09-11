import bpy,sys,math,json,argparse
from pathlib import Path
from mathutils import Vector
parser=argparse.ArgumentParser(description='Render shared linear GLB colors with the paper studio.')
parser.add_argument('--studio-kit',type=Path,required=True)
parser.add_argument('--source-dir',type=Path,required=True)
parser.add_argument('slugs',nargs='+')
args=parser.parse_args(sys.argv[sys.argv.index('--')+1:])
sys.path.insert(0,str(args.studio_kit))
from lib import backdrop,camera
SITE=Path(__file__).resolve().parents[1]
for slug in args.slugs:
 bpy.ops.wm.read_factory_settings(use_empty=True);sc=bpy.context.scene;sc.render.engine='CYCLES';sc.cycles.samples=48;sc.cycles.use_denoising=True
 sc.render.resolution_x=720;sc.render.resolution_y=480;sc.render.resolution_percentage=100;sc.view_settings.view_transform='Standard'
 bpy.ops.import_scene.gltf(filepath=str(args.source_dir/f'{slug}.glb'))
 for mat in bpy.data.materials:
  if mat.use_nodes:
   bs=mat.node_tree.nodes.get('Principled BSDF')
   if bs:bs.inputs['Roughness'].default_value=.9;bs.inputs['Metallic'].default_value=0
 obs=[o for o in bpy.data.objects if o.type=='MESH'];pts=[o.matrix_world@Vector(c) for o in obs for c in o.bound_box];mn=Vector([min(p[i] for p in pts) for i in range(3)]);mx=Vector([max(p[i] for p in pts) for i in range(3)]);ctr=(mn+mx)/2;diag=(mx-mn).length
 backdrop.build_studio((ctr.x,ctr.y,mn.z+diag*.5),diag,cam_az_deg=-55,exposure=.92,white=0)
 camera.place_camera(-55,23,ctr,diag,distance_factor=2.3,focal_mm=50)
 prefs=bpy.context.preferences.addons['cycles'].preferences
 try:
  prefs.compute_device_type='CUDA';prefs.get_devices()
  for d in prefs.devices:d.use=d.type=='CUDA'
  sc.cycles.device='GPU'
 except Exception:pass
 sc.render.image_settings.file_format='JPEG';sc.render.image_settings.quality=94;sc.render.filepath=str(SITE/'assets/images'/f'{slug}-preview.jpg')
 bpy.ops.render.render(write_still=True);print('PREVIEW',slug,flush=True)
