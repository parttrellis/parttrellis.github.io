# PartTrellis showcase assets

The interactive collection contains 14 selected outputs freshly generated with
PartTrellis release commit `c8adb7819d9797cf1c7e67e901ddb394b4217228` and the
released 100k-step checkpoint pair. Object IDs, checkpoint names, inference
settings and triangle counts are recorded in `assets/models/manifest.json`.
Each tile's input image is the actual conditioning image for that output.

Web export retains every source triangle. Connected parts are split into GLB
nodes, triangle winding is made coherent, and smooth normals are recalculated.
There is no decimation, remeshing or manual shape repair. Draco compression uses
16-bit positions and 12-bit normals. Color indicates part identity; the gallery
is a geometry showcase, not the material-generation stage.

The three truck volume files and its part-colored file use the same geometry
and coordinate frame. The viewer supports orbit, zoom, explode, isolate and reset;
rapid asset changes discard stale loads. Assets load on demand. Animation pauses
outside the viewport and respects the reduced-motion preference.

The grey/amber studio background and collection renders reuse the paper's
Blender studio rig. The live WebGL scene uses a matching warm/cool lighting setup,
a coordinated ceramic/brass/terracotta palette and soft ground shadows.

`parttrellis-showcase.mp4` is the existing 52-second application demonstration
(`parttrellis_demo_v3.mp4`, August 10, 2026), remuxed with `faststart` without
re-encoding. It demonstrates image-guided PBR styling and hand-authored joints,
and predates the checkpoint used for the interactive collection. It is labeled
as an application demonstration on the page. English captions are included.

## Local checks

```sh
python scripts/validate_assets.py
python -m http.server 8000
```

Browser verification covers desktop/mobile layouts, every gallery asset,
volume switching, rapid switching, explode/reset/isolate, and video playback.
