---
'@redux-devtools/app': patch
'remotedev-redux-devtools-extension': patch
---

Fix CSP 'unsafe-eval' error preventing Remote DevTools connection by disabling rjsf schema validation on the connection settings form
