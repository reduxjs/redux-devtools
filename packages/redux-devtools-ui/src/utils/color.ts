import { colord, extend, type Colord } from 'colord';
import namesPlugin from 'colord/plugins/names';

extend([namesPlugin]);

/*
  Apply color effects like
    effect('#000000', 'lighten', 0.5);
    effect('#000000', 'fade', 0.5);
    effect('#000000', 'alpha', 0.5);
*/

const effects = {
  lighten: (c: Colord, val: number) => c.lighten(val, { relative: true }),
  fade: (c: Colord, val: number) => c.alpha(c.alpha() * (1 - val)),
  alpha: (c: Colord, val: number) => c.alpha(val),
};

export default (color: string, effect: keyof typeof effects, val: number) =>
  effects[effect](colord(color), val).toHslString();

// TODO: memoize it
