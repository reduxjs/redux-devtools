// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

import React, { useMemo } from 'react';
import JSONNode from './JSONNode';
import createStylingFromTheme from './createStylingFromTheme';
import { invertTheme } from 'react-base16-styling';
import type { StylingValue, Theme } from 'react-base16-styling';
import { CircularPropsPassedThroughJSONTree } from './types';

interface Props extends CircularPropsPassedThroughJSONTree {
  data: any;
  theme?: Theme;
  invertTheme: boolean;
}

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

export function JSONTree({
  data: value,
  theme,
  invertTheme: shouldInvertTheme,
  keyPath = ['root'],
  labelRenderer = defaultLabelRenderer,
  valueRenderer = identity,
  shouldExpandNode = expandRootNode,
  hideRoot = false,
  getItemString = defaultItemString,
  postprocessValue = identity,
  isCustomNode = noCustomNode,
  collectionLimit = 50,
  sortObjectKeys,
}: Props) {
  const styling = useMemo(
    () =>
      createStylingFromTheme(shouldInvertTheme ? invertTheme(theme) : theme),
    [theme, shouldInvertTheme]
  );

  return (
    <ul {...styling('tree')}>
      <JSONNode
        keyPath={hideRoot ? [] : keyPath}
        value={postprocessValue(value)}
        isCustomNode={isCustomNode}
        styling={styling}
        labelRenderer={labelRenderer}
        valueRenderer={valueRenderer}
        shouldExpandNode={shouldExpandNode}
        hideRoot={hideRoot}
        getItemString={getItemString}
        postprocessValue={postprocessValue}
        collectionLimit={collectionLimit}
        sortObjectKeys={sortObjectKeys}
      />
    </ul>
  );
}

export { StylingValue };
