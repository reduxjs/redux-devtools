---
'react-json-tree': minor
---

Remove UNSAFE method from react-json-tree

- Replace `shouldExpandNode` with `shouldExpandNodeInitially`. This function is now only called when a node in the tree is first rendered, when before it would update the expanded state of the node if the results of calling `shouldExpandNode` changed between renders. There is no way to replicate the old behavior exactly, but the new behavior is the intended behavior for the use cases within Redux DevTools. Please open an issue if you need a way to programatically control the expanded state of nodes.
- Bump the minimum React version from `16.3.0` to `16.8.0` so that `react-json-tree` can use hooks.
- Tightened TypeScript prop types to use `unknown` instead of `any` where possible and make the key path array `readonly`.
