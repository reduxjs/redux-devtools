---
'@redux-devtools/extension': patch
---

Fix `stateSanitizer`, `actionSanitizer`, and `predicate` rejecting callbacks annotated with the store's own state and action types
