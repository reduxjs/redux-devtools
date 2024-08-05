import React from 'react';
import type { GetItemString, LabelRenderer } from 'react-json-tree';
import { isCollection, isIndexed, isKeyed } from 'immutable';
import isIterable from '../utils/isIterable';
import { DATA_TYPE_KEY } from '../monitor-config';

const IS_IMMUTABLE_KEY = '@@__IS_IMMUTABLE__@@';

function isImmutable(value: unknown) {
  return isKeyed(value) || isIndexed(value) || isCollection(value);
}

function getShortTypeString(val: unknown, diff: boolean | undefined) {
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
    return Object.keys(val as Record<string, unknown>).length > 0
      ? '{…}'
      : '{}';
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
  previewContent: boolean,
  isDiff: boolean | undefined,
) {
  if (type === 'Object') {
    const keys = Object.keys(data as object);
    if (!previewContent) return keys.length ? '{…}' : '{}';

    const str = keys
      .slice(0, 3)
      .map(
        (key) => `${key}: ${getShortTypeString(data[key], isDiff) as string}`,
      )
      .concat(keys.length > 3 ? ['…'] : [])
      .join(', ');

    return `{ ${str} }`;
  } else if (type === 'Array') {
    if (!previewContent) return data.length ? '[…]' : '[]';

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

export const getItemString: GetItemString = (type: string, data: any) => (
  <span>
    {data[IS_IMMUTABLE_KEY] ? 'Immutable' : ''}
    {DATA_TYPE_KEY && data[DATA_TYPE_KEY]
      ? `${data[DATA_TYPE_KEY] as string} `
      : ''}
    {getText(type, data, false, undefined)}
  </span>
);

export const labelRenderer: LabelRenderer = ([key], nodeType, expanded) => (
  <span>
    <span css={(theme) => ({ color: theme.TEXT_PLACEHOLDER_COLOR })}>
      {key}
    </span>
    {!expanded && ': '}
  </span>
);
