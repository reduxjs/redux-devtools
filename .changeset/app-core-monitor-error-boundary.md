---
'@redux-devtools/app-core': patch
---

Wrap the monitor area in an error boundary so a crashing monitor or tab shows an error with a "Reset monitor state" button instead of blanking the whole app, and reset persisted `inspectedActionPath` / `inspectedStatePath` / selected action ids on rehydrate so a bad persisted selection cannot crash the monitor on every load.
