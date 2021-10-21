import React from 'react';
import { isCollection, isIndexed, isKeyed } from 'immutable';
import { StylingFunction } from 'react-base16-styling';
import isIterable from '../utils/isIterable';

const IS_IMMUTABLE_KEY = '@@__IS_IMMUTABLE__@@';

function isImmutable(value: any) {
  return isKeyed(value) || isIndexed(value) || isCollection(value);
}

function getShortTypeString(val: any, diff: boolean | undefined) {
  if (diff && Array.isArray(val)) {
    val = val[val.length === 2 ? 1 : 0];
  }

  if (isIterable(val) && !isImmutable(val)) {
    return '(…)';
  } else if (Array.isArray(val)) {
    return val.length > 0 ? '[…]' : '[]';
  } else if (val === null) {
    return 'null';
  } else if (val === undefined) {
    return 'undef';
  } else if (typeof val === 'object') {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return Object.keys(val as {}).length > 0 ? '{…}' : '{}';
  } else if (typeof val === 'function') {
    return 'fn';
  } else if (typeof val === 'string') {
    return `"${val.substr(0, 10) + (val.length > 10 ? '…' : '')}"`;
  } else if (typeof val === 'symbol') {
    return 'symbol';
  } else {
    return val;
  }
}

function getText(
  type: string,
  data: any,
  isWideLayout: boolean,
  isDiff: boolean | undefined
) {
  if (type === 'Object') {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const keys = Object.keys(data as {});
    if (!isWideLayout) return keys.length ? '{…}' : '{}';

    const str = keys
      .slice(0, 3)
      .map(
        (key) => `${key}: ${getShortTypeString(data[key], isDiff) as string}`
      )
      .concat(keys.length > 3 ? ['…'] : [])
      .join(', ');

    return `{ ${str} }`;
  } else if (type === 'Array') {
    if (!isWideLayout) return data.length ? '[…]' : '[]';

    const str = data
      .slice(0, 4)
      .map((val: any) => getShortTypeString(val, isDiff))
      .concat(data.length > 4 ? ['…'] : [])
      .join(', ');

    return `[${str as string}]`;
  } else {
    return type;
  }
}

const getItemString = (
  styling: StylingFunction,
  type: string,
  data: any,
  dataTypeKey: string | symbol | undefined,
  isWideLayout: boolean,
  isDiff?: boolean
) => (
  <span {...styling('treeItemHint')}>
    {data[IS_IMMUTABLE_KEY] ? 'Immutable' : ''}
    {dataTypeKey && data[dataTypeKey] ? `${data[dataTypeKey] as string} ` : ''}
    {getText(type, data, isWideLayout, isDiff)}
  </span>
);

export default getItemString;
