// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import JSONNode from './JSONNode';
import createStylingFromTheme from './createStylingFromTheme';
import {
  invertTheme,
  type StylingValue,
  type Theme,
} from 'react-base16-styling';
import { CircularPropsPassedThroughJSONTree } from './types';

type Props = Partial<CircularPropsPassedThroughJSONTree> & {
  data: any;
  theme?: Theme;
  invertTheme?: boolean;
};

const identity = (value: any) => value;
const expandRootNode = (
  keyPath: (string | number)[],
  data: any,
  level: number
) => level === 0;
const defaultItemString = (
  type: string,
  data: any,
  itemType: React.ReactNode,
  itemString: string
) => (
  <span>
    {itemType} {itemString}
  </span>
);
const defaultLabelRenderer = ([label]: (string | number)[]) => (
  <span>{label}:</span>
);
const noCustomNode = () => false;

export function JSONTree(props: Props) {
  const {
    data: value,
    keyPath = ['root'],
    postprocessValue = identity,
    hideRoot = false,
    theme,
    invertTheme: invertThemeProp = true,
    shouldExpandNode = expandRootNode,
    getItemString = defaultItemString,
    labelRenderer = defaultLabelRenderer,
    valueRenderer = identity,
    isCustomNode = noCustomNode,
    collectionLimit = 50,
  } = props;

  const styling = useMemo(() => {
    const finalTheme = invertThemeProp ? invertTheme(theme) : theme;
    return createStylingFromTheme(finalTheme);
  }, [theme, invertThemeProp]);

  return (
    <ul {...styling('tree')}>
      <JSONNode
        postprocessValue={postprocessValue}
        hideRoot={hideRoot}
        styling={styling}
        shouldExpandNode={shouldExpandNode}
        getItemString={getItemString}
        labelRenderer={labelRenderer}
        valueRenderer={valueRenderer}
        isCustomNode={isCustomNode}
        collectionLimit={collectionLimit}
        keyPath={hideRoot ? [] : keyPath}
        value={postprocessValue(value)}
      />
    </ul>
  );
}

JSONTree.propTypes = {
  data: PropTypes.any,
  hideRoot: PropTypes.bool,
  theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  invertTheme: PropTypes.bool,
  keyPath: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  postprocessValue: PropTypes.func,
  sortObjectKeys: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
};

export { StylingValue };
