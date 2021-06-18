import React from 'react';
import { StylingFunction } from 'react-base16-styling';

interface SharedCircularPropsPassedThroughJSONTree {
  keyPath: (string | number)[];
  labelRenderer: (
    keyPath: (string | number)[],
    nodeType: string,
    expanded: boolean,
    expandable: boolean
  ) => React.ReactNode;
}
interface SharedCircularPropsProvidedByJSONTree
  extends SharedCircularPropsPassedThroughJSONTree {
  styling: StylingFunction;
}
interface JSONValueNodeCircularPropsPassedThroughJSONTree {
  valueRenderer: (
    valueAsString: any,
    value: any,
    ...keyPath: (string | number)[]
  ) => React.ReactNode;
}
export type JSONValueNodeCircularPropsProvidedByJSONNode =
  SharedCircularPropsProvidedByJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree;

interface JSONNestedNodeCircularPropsPassedThroughJSONTree {
  shouldExpandNode: (
    keyPath: (string | number)[],
    data: any,
    level: number
  ) => boolean;
  hideRoot: boolean;
  getItemString: (
    nodeType: string,
    data: any,
    itemType: React.ReactNode,
    itemString: string,
    keyPath: (string | number)[]
  ) => React.ReactNode;
  postprocessValue: (value: any) => any;
  isCustomNode: (value: any) => boolean;
  collectionLimit: number;
  sortObjectKeys?: ((a: any, b: any) => number) | boolean;
}
export type CircularPropsPassedThroughJSONTree =
  SharedCircularPropsPassedThroughJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree &
    JSONNestedNodeCircularPropsPassedThroughJSONTree;

interface JSONNestedNodeCircularPropsPassedThroughJSONNode
  extends JSONNestedNodeCircularPropsPassedThroughJSONTree {
  circularCache?: any[];
  isCircular?: boolean;
  level?: number;
}
export type CircularPropsPassedThroughJSONNode =
  SharedCircularPropsProvidedByJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree &
    JSONNestedNodeCircularPropsPassedThroughJSONNode;

export interface JSONNestedNodeCircularPropsPassedThroughJSONNestedNode
  extends JSONNestedNodeCircularPropsPassedThroughJSONNode {
  circularCache: any[];
  level: number;
}
export type CircularPropsPassedThroughJSONNestedNode =
  SharedCircularPropsProvidedByJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree &
    JSONNestedNodeCircularPropsPassedThroughJSONNestedNode;

export type CircularPropsPassedThroughRenderChildNodes =
  SharedCircularPropsProvidedByJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree &
    JSONNestedNodeCircularPropsPassedThroughJSONNestedNode;

export type CircularPropsPassedThroughItemRange =
  SharedCircularPropsProvidedByJSONTree &
    JSONValueNodeCircularPropsPassedThroughJSONTree &
    JSONNestedNodeCircularPropsPassedThroughJSONNestedNode;
