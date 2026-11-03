---
'@redux-devtools/ui': patch
---

`listSchemes()` no longer drops the first color scheme. It used `.slice(1)` to skip a CommonJS `__esModule` key that the ESM scheme object does not have, so `threezerotwofour` was missing from the scheme list in the Themes settings.
