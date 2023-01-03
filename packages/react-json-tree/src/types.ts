import React from 'react';
import { StylingFunction } from 'react-base16-styling';

export type Key = string | number;

export type KeyPath = (string | number)[];

export type GetItemString = (
  nodeType: string,
  data: any,
  itemType: React.ReactNode,
  itemString: string,
  keyPath: KeyPath
) => React.ReactNode;

export type LabelRenderer = (
  keyPath: KeyPath,
  nodeType: string,
  expanded: boolean,
  expandable: boolean
) => React.ReactNode;

export type ValueRenderer = (
  valueAsString: any,
  value: any,
  ...keyPath: KeyPath
) => React.ReactNode;

export type ShouldExpandNode = (
  keyPath: KeyPath,
  data: any,
  level: number
) => boolean;

export type PostprocessValue = (value: any) => any;

export type IsCustomNode = (value: any) => boolean;

export type SortObjectKeys = ((a: any, b: any) => number) | boolean;

export type Styling = StylingFunction;

export type CircularCache = any[];

export interface CommonExternalProps {
  keyPath: KeyPath;
  labelRenderer: LabelRenderer;
  valueRenderer: ValueRenderer;
  shouldExpandNode: ShouldExpandNode;
  hideRoot: boolean;
  getItemString: GetItemString;
  postprocessValue: PostprocessValue;
  isCustomNode: IsCustomNode;
  collectionLimit: number;
  sortObjectKeys: SortObjectKeys;
}

export interface CommonInternalProps extends CommonExternalProps {
  styling: StylingFunction;
  circularCache?: CircularCache;
  isCircular?: boolean;
  level?: number;
}
