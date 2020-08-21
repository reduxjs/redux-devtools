import React from 'react';
import PropTypes from 'prop-types';
import JSONNestedNode from './JSONNestedNode';
import { CircularPropsPassedThroughJSONNode } from './types';

// Returns the "n Items" string for this node,
// generating and caching it if it hasn't been created yet.
function createItemString(data: any) {
  return `${(data as unknown[]).length} ${
    (data as unknown[]).length !== 1 ? 'items' : 'item'
  }`;
}

interface Props extends CircularPropsPassedThroughJSONNode {
  data: any;
  nodeType: string;
}

// Configures <JSONNestedNode> to render an Array
const JSONArrayNode: React.FunctionComponent<Props> = ({ data, ...props }) => (
  <JSONNestedNode
    {...props}
    data={data}
    nodeType="Array"
    nodeTypeIndicator="[]"
    createItemString={createItemString}
    expandable={data.length > 0}
  />
);

JSONArrayNode.propTypes = {
  data: PropTypes.array,
};

export default JSONArrayNode;
