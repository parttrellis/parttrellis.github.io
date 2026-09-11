# Public text checked against the paper

Reviewed against Overleaf project `6a6070d2d8e7f2145e47dae9`, revision
`5747573f0b798295e4f8ef43aec9994af9d5c2be`, on 2026-09-11.
The active manuscript uses `sec2/` (`vtwotrue` in `main.tex`).

Scope: homepage headings/body, metadata, author affiliations, citation, viewer
labels and controls, social preview text, all video captions, part callouts,
application badges, title/end cards, and WebVTT captions.

- Method overview and inference define parts as connected components of decoded
  O-Voxel volumes. The model does not output semantic class labels. Video says
  “Generated as separate part meshes”; callouts use Part 1, Part 2, etc.
- The paper extends TRELLIS.2 with two O-Voxel volumes, without input masks or
  a segmentation network. Homepage method text now states this directly.
- Material styling and manually authored joints/motion in the application video
  are downstream demonstrations. Removed “game-ready”, “Physically plausible
  articulation”, and “Ready for games & simulation”. Reassembly is described as
  returning parts to their original positions, not learned assembly.
- The closing card describes separate part meshes, not an unconditional promise
  of delivered materials. The opening retains the paper title.
- All 42 values in the main results table and all 24 values in the whole-object
  reference table exactly match the active paper tables. The 986-object scope,
  Hungarian matching, alignment protocol, and failure definition are explicit.
  Comparative claims are restricted to evaluated methods.
- Author institution indices/order and Zheng-hui Huang spelling match the latest
  manuscript. Citation uses a manuscript entry instead of an unverified arXiv
  publication claim.
- Viewer mesh names already use neutral part/volume IDs; no semantic labels are
  presented as model outputs. Object category names only identify gallery items.
- Social preview contains the correct paper title and descriptive gallery text.

Reviewed video source is `video-rollout/branded/storyboard-reviewed.json` in
`../parttrellis-showcase-work/`. `reviewed_tail.py` recomposites the original
renders with these words; the original archival storyboard is left intact.
