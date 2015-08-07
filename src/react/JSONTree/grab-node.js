import React from 'react';
import objType from './obj-type';
import JSONObjectNode from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';
import JSONStringNode from './JSONStringNode';
import JSONNumberNode from './JSONNumberNode';
import JSONBooleanNode from './JSONBooleanNode';
import JSONNullNode from './JSONNullNode';

export default function(key, value) {
  const nodeType = objType(value);
  const aKey = key + Date.now();
  if (nodeType === 'Object') {
    return <JSONObjectNode data={value} keyName={key} key={aKey} />;
  } else if (nodeType === 'Array') {
    return <JSONArrayNode data={value} keyName={key} key={aKey} />;
  } else if (nodeType === 'String') {
    return <JSONStringNode keyName={key} value={value} key={aKey} />;
  } else if (nodeType === 'Number') {
    return <JSONNumberNode keyName={key} value={value} key={aKey} />;
  } else if (nodeType === 'Boolean') {
    return <JSONBooleanNode keyName={key} value={value} key={aKey} />;
  } else if (nodeType === 'Null') {
    return <JSONNullNode keyName={key} value={value} key={aKey} />;
  }
  console.error('Unknown node type:', nodeType);
  return false;
}
