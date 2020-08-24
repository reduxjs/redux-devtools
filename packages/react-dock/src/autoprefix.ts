// Same as https://github.com/SimenB/react-vendor-prefixes/blob/master/src/index.js,
// but dumber

import { CSSProperties } from 'react';

const vendorSpecificProperties = [
  'animation',
  'animationDelay',
  'animationDirection',
  'animationDuration',
  'animationFillMode',
  'animationIterationCount',
  'animationName',
  'animationPlayState',
  'animationTimingFunction',
  'appearance',
  'backfaceVisibility',
  'backgroundClip',
  'borderImage',
  'borderImageSlice',
  'boxSizing',
  'boxShadow',
  'contentColumns',
  'transform',
  'transformOrigin',
  'transformStyle',
  'transition',
  'transitionDelay',
  'transitionDuration',
  'transitionProperty',
  'transitionTimingFunction',
  'perspective',
  'perspectiveOrigin',
  'userSelect',
];

const prefixes = ['Moz', 'Webkit', 'ms', 'O'];

function prefixProp<Value>(key: string, value: Value) {
  return prefixes.reduce<{ [key: string]: Value }>(
    (obj, pre) => (
      (obj[pre + key[0].toUpperCase() + key.substr(1)] = value), obj
    ),
    {}
  );
}

export default function autoprefix(style: CSSProperties) {
  return Object.keys(style).reduce(
    (obj, key) =>
      vendorSpecificProperties.indexOf(key) !== -1
        ? {
            ...obj,
            ...prefixProp(key, style[key as keyof CSSProperties]),
          }
        : obj,
    style
  );
}
