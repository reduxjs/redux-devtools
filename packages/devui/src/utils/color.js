import Color from 'color';

/*
  Apply color effects like
    effect('#ffffff', 'darken', 0.5);
    effect('#000000', 'lighten', 0.5);
    effect('#000000', 'alpha', 0.5);
*/

export default (color, effect, val) =>
  new Color(color)
    [effect](val)
    .hsl()
    .string();

// TODO: memoize it
