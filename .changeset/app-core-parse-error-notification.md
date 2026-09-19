---
'@redux-devtools/app-core': patch
---

Show an error notification and keep the previous instance state when a state payload fails to parse, instead of blanking the panel. Adds `parseErrorMiddleware` (included in the default `middlewares` array).
