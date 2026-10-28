---
'remotedev-redux-devtools-extension': patch
'@redux-devtools/utils': patch
---

Pass the dispatched action to a custom `trace` function, matching the documented `trace: (action) => string` signature
