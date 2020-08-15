// Same as https://github.com/SimenB/react-vendor-prefixes/blob/master/src/index.js,
// but dumber

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
  'userSelect'
];

const prefixes = ['Moz', 'Webkit', 'ms', 'O'];

function prefixProp(key, value) {
  return prefixes.reduce(
    (obj, pre) => (obj[pre + key[0].toUpperCase() + key.substr(1)] = value, obj),
    {}
  );
}

export default function autoprefix(style) {
  return Object.keys(style).reduce((obj, key) => (
    vendorSpecificProperties.indexOf(key) !== -1 ? {
      ...obj,
      ...prefixProp(key, style[key])
    } : obj), style);
}
