---
'@redux-devtools/app-core': patch
---

Keep the persist setting when an instance is removed. Removing an instance used to drop `persisted` from the instances state, so the persist button turned off on its own after a disconnect, and in the extension the first click to turn persist off left it on.
