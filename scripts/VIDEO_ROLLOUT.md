# Homepage video and branding

The eight-second opening retains the original near-black background. The
provided Alaya triangle icon plus white lowercase `alayalab` appears above the
pink-blue PartTrellis title. Yellow-gray studio backgrounds are confined to
rounded image cards. Their objects rotate in 3D at 10 degrees/second while the
cards travel right to left at 175 pixels/second. A queue extends offscreen;
there is no loop, visible queue endpoint, slowdown, or fade-out before the cut.

The right-corner branding in every demonstration segment and the ending card
use the same supplied icon and white wordmark. The old cyan wordmarks and the
spaced-out Alaya footer name are removed. Demonstration scenes, motion, and
caption timing are retained. Branding is the only tail edit; the movie is
re-encoded to H.264 for playback. Total: 1660 frames, 55.333333 seconds,
1920 x 1088, 30 fps, no audio.

Original editable project:
`/gs/bs/tga-koike-shanda2/yurh/KaiNinja_v2/eval_gamepage/demo_video/`
- `compose.py`, `storyboard_v3.json`, `anim_render.py`, `final_frames_v3/`

Current editable source:
`/gs/fs/tga-koike-shanda4/yurh/parttrellis-showcase-work/video-rollout/branded/`
- `brand.py`: supplied triangle icon + white wordmark, and tail brand placement
- `render_turntables.py`: genuine 3D studio rotation frames, split across GPUs
- `turntables_v2/`: transparent rendered objects and shadows
- `compose_video.py`: black opening, studio cards, and tail branding
- `branded-rollout.mp4`, `manifest.json`: final output and settings

The graphic is extracted from `assets/figures/logo.png`; it is not redrawn.
The original movie remains backed up as `../original.mp4`. The current tail
starts at 8 seconds, corresponding to original frame 130. Only the title card
was lengthened; subtitles were shifted by 110 frames in the earlier revision.
