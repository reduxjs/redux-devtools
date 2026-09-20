import React from 'react';
import JSONNestedNode from './JSONNestedNode.js';
import type { CommonInternalProps } from './types.js';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: unknown) {
  const len = Object.getOwnPropertyNames(data).length;
  return `${len} ${len !== 1 ? 'keys' : 'key'}`;
}

interface Props extends CommonInternalProps {
  data: unknown;
  nodeType: string;
}

// Configures <JSONNestedNode> to render an Object
export default function JSONObjectNode({ data, ...props }: Props) {
  return (
    <JSONNestedNode
      {...props}
      data={data}
      nodeType="Object"
      nodeTypeIndicator={props.nodeType === 'Error' ? 'Error()' : '{}'}
      createItemString={createItemString}
      expandable={Object.getOwnPropertyNames(data).length > 0}
    />
  );
}
