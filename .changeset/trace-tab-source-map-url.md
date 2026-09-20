---
'@redux-devtools/inspector-monitor-trace-tab': patch
---

Resolve `sourceMappingURL` against the bundle URL with `new URL()` instead of string concatenation, so absolute and parent-relative map URLs load correctly. Percent-encoded inline source maps are now decoded instead of rejected, and a failed source-map fetch is reported instead of being parsed as JSON.
