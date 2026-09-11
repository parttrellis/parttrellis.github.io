# Shared part colors

The palette in `sync_part_colors.py` comes from the paper's `qfig_jobs.jsonl`:
`part_colors_linear=true`, roughness 0.9, studio exposure 0.92. Those hex bytes
were authored as linear shader inputs; do not decode them as sRGB. No extra
white mix is applied. The former website palette was a separate muted palette.

`sync_part_colors.py` assigns these linear colors to stable part names in the
published GLBs and optionally to an uncompressed preview copy. It changes only
material JSON; node metadata, mesh data and compressed buffers are preserved.
The interactive viewer uses the embedded GLB colors directly. Its output is
sRGB with no cinematic tone mapping, matching Blender's Standard view transform.
A neutral fill and mild warm key approximate the paper studio in real time.
Blender's indirect illumination still produces natural shading differences.

To rebuild, pass the original oriented GLB directory to
`sync_part_colors.py --preview-source DIR --preview-output NEW_DIR`, then run
Blender with `--python scripts/render_part_previews.py -- --studio-kit KIT_DIR
--source-dir NEW_DIR chair ...`. The studio geometry, light ratios, 0.92 light
scale, and yellow-gray background are retained. Update the GLB, thumbnail, and
viewer script URL versions in `index.html` when publishing new colors.
