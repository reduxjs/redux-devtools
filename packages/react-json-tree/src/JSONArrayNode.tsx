import React from 'react';
import JSONNestedNode from './JSONNestedNode.js';
import type { CommonInternalProps } from './types.js';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: unknown) {
  return `${(data as unknown[]).length} ${
    (data as unknown[]).length !== 1 ? 'items' : 'item'
  }`;
}

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
}

// Configures <JSONNestedNode> to render an Array
export default function JSONArrayNode({ data, ...props }: Props) {
  return (
    <JSONNestedNode
      {...props}
      data={data}
      nodeType="Array"
      nodeTypeIndicator="[]"
      createItemString={createItemString}
      expandable={(data as unknown[]).length > 0}
    />
  );
}
