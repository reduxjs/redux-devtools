---
'@redux-devtools/inspector-monitor': patch
'@redux-devtools/inspector-monitor-trace-tab': patch
---

Fix the Trace tab crashing (and blanking the whole DevTools panel) after drilling into an action in the Action tab. The inspector now passes `currentActionId` to tab components, and the Trace tab looks up the lifted action by id instead of by object reference.
