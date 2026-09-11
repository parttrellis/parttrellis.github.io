# Homepage video opening

The opening is an eight-second, unbroken right-to-left procession on the
homepage's yellow-gray studio background. Fourteen unique generated assets
form an offscreen queue; only a portion passes through the viewport. There is
no wrap, repeated object, deceleration, final fade, or visible queue endpoint.
Objects have transparent paper-studio renders instead of white thumbnail cards.
The title uses a muted pink-to-blue gradient with one short subtitle.

Motion is 175 px/s, down from approximately 488 px/s in the first rollout.
The original 47.333333-second demonstration follows at 8 seconds. Its 1420
frames are stream-copied and retain identical decoded pixels. Captions shift
by exactly 110 frames (3.666667 seconds). Total: 1660 frames, 55.333333 seconds,
1920 x 1088, 30 fps, no audio.

Original editable project:
`/gs/bs/tga-koike-shanda2/yurh/KaiNinja_v2/eval_gamepage/demo_video/`
- `compose.py`: original compositor
- `storyboard_v3.json`: original timeline
- `anim_render.py`: original 3D animation renderer
- `final_frames_v3/`: original composed frame sequence

Current opening sources and verification:
`/gs/fs/tga-koike-shanda4/yurh/parttrellis-showcase-work/video-rollout/`
- `render_rollout_studio.py`: transparent studio renders with shadow catchers
- `compose_rollout.py`: current animation, writes `studio_intro_frames/`
- `rollout.json`: assets, speed, frame count and splice metadata
- `studio-intro.mp4`, `tail.mp4`, `studio-concat.txt`, `studio-rollout.mp4`
- `original.mp4`: original homepage movie before either opening revision
- `original-tail.md5`, `studio-tail.md5`: tail pixel hashes (timestamps differ
  by exactly the added 110 frames)
