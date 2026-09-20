import * as d3 from 'd3';
import type { BaseType, Selection } from 'd3';

export type StyleValue = string | number | boolean;

interface Options<
  Datum,
  RootGElement extends BaseType,
  RootDatum,
  RootPElement extends BaseType,
  RootPDatum,
> {
  left: number | undefined;
  top: number | undefined;
  offset: {
    left: number;
    top: number;
  };
  root:
    | Selection<RootGElement, RootDatum, RootPElement, RootPDatum>
    | undefined;
  styles: { [key: string]: StyleValue };
  text: string | ((datum: Datum) => string);
}

const defaultOptions: Options<unknown, BaseType, unknown, BaseType, unknown> = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: { left: 0, top: 0 },
  root: undefined,
  styles: {},
  text: '',
};

export function tooltip<
  GElement extends BaseType,
  Datum,
  PElement extends BaseType,
  PDatum,
  RootGElement extends BaseType,
  RootDatum,
  RootPElement extends BaseType,
  RootPDatum,
>(
  className = 'tooltip',
  options: Partial<
    Options<Datum, RootGElement, RootDatum, RootPElement, RootPDatum>
  > = {},
) {
  const { left, top, offset, root, styles, text } = {
    ...defaultOptions,
    ...options,
  } as Options<Datum, RootGElement, RootDatum, RootPElement, RootPDatum>;

  let el: Selection<HTMLDivElement, RootDatum, BaseType, unknown>;
  const anchor: Selection<
    RootGElement,
    RootDatum,
    RootPElement | HTMLElement,
    RootPDatum
  > = root || d3.select<RootGElement, RootDatum>('body');
  const rootNode = anchor.node()!;

  return function tip(selection: Selection<GElement, Datum, PElement, PDatum>) {
    selection.on('mouseover.tip', (event, datum) => {
      const [pointerX, pointerY] = d3.pointer(event, rootNode);
      const [x, y] = [
        left || pointerX + offset.left,
        top || pointerY - offset.top,
      ];

      anchor.selectAll(`div.${className}`).remove();

      el = anchor
        .append('div')
        .attr('class', className)
        .style('position', 'absolute')
        .style('z-index', 1001)
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .html(typeof text === 'function' ? () => text(datum) : () => text);

      for (const [key, value] of Object.entries(styles)) {
        el.style(key, value);
      }
    });

    selection.on('mousemove.tip', (event, datum) => {
      const [pointerX, pointerY] = d3.pointer(event, rootNode);
      const [x, y] = [
        left || pointerX + offset.left,
        top || pointerY - offset.top,
      ];

      el.style('left', `${x}px`)
        .style('top', `${y}px`)
        .html(typeof text === 'function' ? () => text(datum) : () => text);
    });

    selection.on('mouseout.tip', () => el.remove());
  };
}
