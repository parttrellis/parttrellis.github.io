# KaiNinja / AlayaLab branding

The public project name is KaiNinja. The project keeps its existing hosting and
repository URLs. The homepage header credits AlayaLab; the full author list and
institution affiliations appear in Team at the end, following the PWM page.
The logo is the user-supplied transparent artwork, copied without redrawing to
`assets/figures/alayalab-logo.png`. Dark surfaces show it in white.

The paper uses the same project name and logo, with full authors and correspondence
at the end. Scientific text and reported numbers are otherwise retained.

Teaser source:
`../parttrellis-showcase-work/rebrand/teaser_kaininja.py`
The scene is reconstructed from the original v21 script, recovered layout and
`/gs/bs/tga-koike-shanda2/yurh/KaiNinja_v2/eval_gamepage/teaser/pp86` meshes.
KaiNinja is one 3D text object with a continuous pink-to-ice-blue emission ramp,
so its floor reflection and glow are rendered from the same material.
The final reusable scene is saved beside the rendered output.

Final scene: `rebrand/teaser-final.blend`; renderer: `render_final.py`.
`refine_teaser.py` restores the principal placements and muted palettes from
the paper reference after recovery. The recovered scene is not pixel-identical
to the archived v21 image. Both the manuscript and homepage use the same final PNG.
