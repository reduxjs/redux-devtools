import React from 'react';
import PropTypes from 'prop-types';
import type {
  GetItemString,
  Key,
  KeyPath,
  LabelRenderer,
  Styling,
  ValueRenderer,
} from './types';

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
  value: any;
  valueRenderer: ValueRenderer;
  valueGetter?: (value: any) => any;
}

const JSONValueNode: React.FunctionComponent<Props> = ({
  nodeType,
  styling,
  labelRenderer,
  keyPath,
  valueRenderer,
  value,
  valueGetter = (value) => value,
}) => (
  <li {...styling('value', nodeType, keyPath)}>
    <label {...styling(['label', 'valueLabel'], nodeType, keyPath)}>
      {labelRenderer(keyPath, nodeType, false, false)}
    </label>
    <span {...styling('valueText', nodeType, keyPath)}>
      {valueRenderer(valueGetter(value), value, ...keyPath)}
    </span>
  </li>
);

JSONValueNode.propTypes = {
  nodeType: PropTypes.string.isRequired,
  styling: PropTypes.func.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
  ).isRequired,
  valueRenderer: PropTypes.func.isRequired,
  value: PropTypes.any,
  valueGetter: PropTypes.func,
};

export default JSONValueNode;
