import * as d3 from 'd3';
import type { BaseType, ContainerElement, Selection } from 'd3';
import { is } from 'ramda';
import functor from './utils/functor';

interface Options<
  GElement extends ContainerElement,
  Datum,
  PElement extends BaseType,
  PDatum
> {
  left: number | undefined;
  top: number | undefined;
  offset: {
    left: number;
    top: number;
  };
  root: Selection<GElement, Datum, PElement, PDatum> | undefined;
}

const defaultOptions: Options<ContainerElement, unknown, BaseType, unknown> = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: { left: 0, top: 0 },
  root: undefined,
};

export type StyleValue = string | number | boolean;

interface Tip<
  GElement extends BaseType,
  Datum,
  PElement extends BaseType,
  PDatum
> {
  (selection: Selection<GElement, Datum, PElement, PDatum>): void;
  styles: (
    this: this,
    value: { [key: string]: StyleValue } | undefined
  ) => this;
  text: (
    this: this,
    value:
      | string
      | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) => this;
}

export function tooltip<
  GElement extends BaseType,
  Datum,
  PElement extends BaseType,
  PDatum,
  RootGElement extends ContainerElement,
  RootDatum,
  RootPElement extends BaseType,
  RootPDatum
>(
  className = 'tooltip',
  options: Partial<
    Options<RootGElement, RootDatum, RootPElement, RootPDatum>
  > = {}
): Tip<GElement, Datum, PElement, PDatum> {
  const { left, top, offset, root } = {
    ...defaultOptions,
    ...options,
  } as Options<RootGElement, RootDatum, RootPElement, RootPDatum>;

  let text: (
    datum: Datum,
    index?: number,
    outerIndex?: number
  ) => string = () => '';
  let styles: { [key: string]: StyleValue } = {};

  let el: Selection<HTMLDivElement, RootDatum, BaseType, unknown>;
  const anchor: Selection<
    RootGElement,
    RootDatum,
    RootPElement | HTMLElement,
    RootPDatum
  > = root || d3.select<RootGElement, RootDatum>('body');
  const rootNode = anchor.node()!;

  function tip(selection: Selection<GElement, Datum, PElement, PDatum>) {
    selection.on('mouseover.tip', (node) => {
      const [mouseX, mouseY] = d3.mouse(rootNode);
      const [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

      anchor.selectAll(`div.${className}`).remove();

      el = anchor
        .append('div')
        .attr('class', className)
        .style('position', 'absolute')
        .style('z-index', 1001)
        .style('left', `${x}px`)
        .style('top', `${y}px`)
        .html(() => text(node));

      for (const [key, value] of Object.entries(styles)) {
        el.style(key, value);
      }
    });

    selection.on('mousemove.tip', (node) => {
      const [mouseX, mouseY] = d3.mouse(rootNode);
      const [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

      el.style('left', `${x}px`)
        .style('top', `${y}px`)
        .html(() => text(node));
    });

    selection.on('mouseout.tip', () => el.remove());
  }

  tip.styles = function setStyles(
    this: typeof tip,
    value: { [key: string]: StyleValue } | undefined
  ) {
    if (is(Object, value)) {
      styles = { ...styles, ...value };
    }
    return this;
  };

  tip.text = function setText(
    this: typeof tip,
    value:
      | string
      | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) {
    text = functor(value);
    return this;
  };

  return tip;
}
