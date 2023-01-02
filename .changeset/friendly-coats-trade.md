---
'd3-state-visualizer': major
---

- Remove UMD build.
- Split `style` option into `chartStyles`, `nodeStyleOptions`, `textStyleOptions`, and `linkStyles`.
- The shape of the argument passed to the option `onClickText` has been updated to match the d3 v4 node.
- Rename `InputOptions` to `Options`, `Primitive` to `StyleValue`, and `NodeWithId` to `HierarchyPointNode<Node>`.
