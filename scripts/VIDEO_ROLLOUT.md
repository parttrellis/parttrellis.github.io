# Homepage video and branding

The eight-second opening retains the original near-black background. The
provided Alaya triangle icon plus white `AlayaLab` appears above the
pink-blue PartTrellis title, with the paper subtitle
“Extending Native 3D Generators to the Part Level”. Yellow-gray studio backgrounds are confined to
rounded image cards. Their objects rotate in 3D at 20 degrees/second while the
cards travel right to left at 175 pixels/second. A queue extends offscreen;
there is no loop, visible queue endpoint, or slowdown. The complete opening
fades in over 20 frames; at the scene boundary it fades out over 20 frames
and the demonstration fades in over 20 frames, using a smoothstep curve
through the original near-black background.

The right-corner branding in every demonstration segment and the ending card
use the same supplied icon and white wordmark. The old cyan wordmarks and the
spaced-out Alaya footer name are removed. Demonstration scenes, motion, and
caption timing are retained. Text is reviewed against the active paper (see
CONTENT_AUDIT.md). The tail receives revised captions, neutral part callouts,
explicit hand-authored motion badges, new branding and a 20-frame fade-in; the movie is
re-encoded to H.264 for playback. Total: 1660 frames, 55.333333 seconds,
1920 x 1088, 30 fps, no audio.

Original editable project:
`/gs/bs/tga-koike-shanda2/yurh/KaiNinja_v2/eval_gamepage/demo_video/`
- `compose.py`, `storyboard_v3.json`, `anim_render.py`, `final_frames_v3/`

Current editable source:
`/gs/fs/tga-koike-shanda4/yurh/parttrellis-showcase-work/video-rollout/branded/`
- `brand.py`: supplied triangle icon + white wordmark, and tail brand placement
- `render_turntables.py`: genuine 3D studio rotation frames, split across GPUs
- `turntables_v3/`: transparent rendered objects and shadows
- `compose_video.py`: black opening, studio cards, and tail branding
- `branded-rollout.mp4`, `manifest.json`: final output and settings

The graphic is extracted from `assets/figures/logo.png`; it is not redrawn.
The original movie remains backed up as `../original.mp4`. The current tail
starts at 8 seconds, corresponding to original frame 130. Only the title card
was lengthened; subtitles were shifted by 110 frames in the earlier revision.

Paper-aligned tail source: `storyboard-reviewed.json` and `reviewed_tail.py`.
