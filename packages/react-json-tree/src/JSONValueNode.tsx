import React from 'react';
import type {
  GetItemString,
  Key,
  KeyPath,
  LabelRenderer,
  Styling,
  ValueRenderer,
} from './types.js';

/**
 * Renders simple values (eg. strings, numbers, booleans, etc)
 */

interface Props {
  getItemString: GetItemString;
  key: Key;
  keyPath: KeyPath;
  labelRenderer: LabelRenderer;
  nodeType: string;
  styling: Styling;
  value: unknown;
  valueRenderer: ValueRenderer;
  valueGetter?: (value: any) => unknown;
}

export default function JSONValueNode({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter = (value) => value,
}: Props) {
  return (
    <li {...styling('value', nodeType, keyPath)}>
      <label {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
        {labelRenderer(keyPath, nodeType, false, false)}
      </label>
      <span {...styling('valueText', nodeType, keyPath)}>
        {valueRenderer(valueGetter(value), value, ...keyPath)}
      </span>
    </li>
  );
}
