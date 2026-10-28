---
'@redux-devtools/slider-monitor': patch
---

Fix live-speed playback skipping the last action and dispatching `jumpToAction(undefined)` at the end of the timeline
