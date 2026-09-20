import Color from 'color';

/*
  Apply color effects like
    effect('#ffffff', 'darken', 0.5);
    effect('#000000', 'lighten', 0.5);
    effect('#000000', 'alpha', 0.5);
*/

export default (
  color: string,
  effect: 'fade' | 'lighten' | 'alpha',
  val: number,
) => new Color(color)[effect](val).hsl().string();

// TODO: memoize it
