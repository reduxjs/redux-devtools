---
"@redux-devtools/inspector-monitor-trace-tab": patch
---

Clicking a stack frame outside the browser extension no longer throws `ReferenceError: chrome is not defined`; it opens the file URL in a new tab instead.
