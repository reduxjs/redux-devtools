---
'@redux-devtools/utils': patch
'@redux-devtools/remote': patch
---

Serialize BigInt values as `"<digits>n"` strings and stop serialization failures from throwing out of `store.dispatch`. `@redux-devtools/utils` `stringify` applies the BigInt replacer in every path and exports `withBigIntReplacer`; `@redux-devtools/remote` uses it and relays an `ERROR` message to the monitor when a state or action cannot be serialized.
