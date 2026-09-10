# PartTrellis showcase assets

The collection contains 14 curated outputs generated with release commit
`c8adb7819d9797cf1c7e67e901ddb394b4217228` and the released 100k-step checkpoint
pair. The actual conditioning image accompanies each output. Provenance, inference
settings and triangle counts are in `assets/models/manifest.json`.

## Curation and geometry

The revised collection was selected after screening the previous 14 examples
and 38 newly generated candidates. Visibly fractured, duplicated, weakly structured
and excessively heavy candidates were excluded, rather than repaired for display.
Every selected asset was inspected from four angles and part by part. Surface
proximity and pairwise ray-parity containment support the inspection; numerical
proximity alone does not distinguish a valid contact from duplicate geometry.
Per-part diagnostics are in `assets/models/quality-report.json`.

Selected outputs retain every source triangle. Export recenters the meshes,
recalculates coherent winding and smooth normals, and splits the existing part
labels into nodes. There is no decimation, remeshing, selective part deletion or
manual shape repair. Draco uses 20-bit positions and 14-bit normals with shared
scene bounds. Round-trip decoding verifies identical triangle counts.

The method example is the dining chair. `method-a.glb`, `method-b.glb`,
`method-volumes.glb` and its part-colored file share the original geometry and
coordinate frame. A + B has exactly the same triangles as the full part view.

## Rendering

The background and thumbnails reuse `blender_kit/lib/backdrop.py`, the paper's
studio rig: emitter radiances (10, 6, 0.5) and (20, 25, 40), ambient 0.75, and
backdrop exposure 0.92. The display transform is **Standard**, matching the paper,
replacing the previous AgX contrast treatment. Blender thumbnails use the paper's
linear palette convention and roughness 0.9. The browser adapts the same warm/cool
appearance to real-time lighting, with a muted ceramic/brass/terracotta palette.

Assets load on demand. Orbit, zoom, explode, isolate and reset remain available.
Stale loads are discarded on rapid switching; offscreen animation pauses and the
reduced-motion preference is respected.

## Application video

`parttrellis-showcase.mp4` is the existing 52-second application demonstration
(`parttrellis_demo_v3.mp4`, August 10, 2026), remuxed with faststart without
re-encoding. It demonstrates image-guided PBR styling and hand-authored joints,
and predates the checkpoint used for the interactive collection. It is labeled
as an application demonstration. English captions are included.

## Verification

```sh
python scripts/validate_assets.py
python -m http.server 8000
```

Browser verification covers all assets, desktop/mobile layouts, volume switching,
rapid switching, explode/reset/isolate, and actual video playback.
