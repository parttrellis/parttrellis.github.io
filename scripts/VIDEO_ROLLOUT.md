# Homepage video opening

The first 130 frames (4.333333 seconds at 30 fps) now contain a continuous
right-to-left strip of 12 objects. Four original material-prompt images are
interleaved with eight renders of the curated homepage geometry, using its
shared part colors. Title text and the full 1550-frame timeline are retained.

Original editable project:
`/gs/bs/tga-koike-shanda2/yurh/KaiNinja_v2/eval_gamepage/demo_video/`
- `compose.py`: original compositor
- `storyboard_v3.json`: original timeline
- `anim_render.py`: 3D animation renderer
- `final_frames_v3/`: original composed frame sequence

Current editable opening and verification:
`/gs/fs/tga-koike-shanda4/yurh/parttrellis-showcase-work/video-rollout/`
- `render_rollout_assets.py`: transparent renders for the eight added objects
- `compose_rollout.py`: title-card strip animation, writes `intro_frames/`
- `rollout.json`: source asset list and exact cut frame
- `original.mp4`, `intro.mp4`, `tail.mp4`, `concat.txt`, `rollout.mp4`
- `original-tail.md5`, `rollout-tail.md5`: matching decoded frame hashes

The source has a keyframe at frame 130. The tail is stream-copied from that
keyframe, then concatenated with the newly encoded opening. Every decoded frame
and timestamp from frame 130 onward matches the previous homepage video exactly.
The final movie remains 1920 x 1088, 30 fps, 51.666667 seconds, with no audio.
