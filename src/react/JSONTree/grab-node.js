import React from 'react';
import objType from './obj-type';
import JSONObjectNode from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';
import JSONStringNode from './JSONStringNode';
import JSONNumberNode from './JSONNumberNode';
import JSONBooleanNode from './JSONBooleanNode';
import JSONNullNode from './JSONNullNode';

export default function(key, value, prevValue, theme) {
  const nodeType = objType(value);
  const aKey = key + Date.now();
  if (nodeType === 'Object') {
    return <JSONObjectNode data={value} previousData={prevValue} theme={theme} keyName={key} key={aKey} />;
  } else if (nodeType === 'Array') {
    return <JSONArrayNode data={value} previousData={prevValue} theme={theme} keyName={key} key={aKey} />;
  } else if (nodeType === 'String') {
    return <JSONStringNode keyName={key} previousValue={prevValue} theme={theme} value={value} key={aKey} />;
  } else if (nodeType === 'Number') {
    return <JSONNumberNode keyName={key} previousValue={prevValue} theme={theme} value={value} key={aKey} />;
  } else if (nodeType === 'Boolean') {
    return <JSONBooleanNode keyName={key} previousValue={prevValue} theme={theme} value={value} key={aKey} />;
  } else if (nodeType === 'Null') {
    return <JSONNullNode keyName={key} previousValue={prevValue} theme={theme} value={value} key={aKey} />;
  }
  return false;
}
