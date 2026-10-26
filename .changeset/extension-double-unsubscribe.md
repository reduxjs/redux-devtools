---
'remotedev-redux-devtools-extension': patch
---

Calling the function returned by `connect().subscribe()` more than once no longer removes a different listener.
