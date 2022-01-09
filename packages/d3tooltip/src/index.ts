import d3Package, { Primitive, Selection } from 'd3';
import { is } from 'ramda';
import utils from './utils';
const { prependClass, functor } = utils;

interface Options<Datum> {
  left: number | undefined;
  top: number | undefined;
  offset: {
    left: number;
    top: number;
  };
  root: Selection<Datum> | undefined;
}

const defaultOptions: Options<unknown> = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: { left: 0, top: 0 },
  root: undefined,
};

interface Tip<Datum> {
  (selection: Selection<Datum>): void;
  attr: (
    this: this,
    d:
      | string
      | {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }
  ) => this;
  style: (
    this: this,
    d:
      | string
      | {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }
      | undefined
  ) => this;
  text: (
    this: this,
    d: string | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) => this;
}

export function tooltip<Datum>(
  d3: typeof d3Package,
  className = 'tooltip',
  options: Partial<Options<Datum>> = {}
): Tip<Datum> {
  const { left, top, offset, root } = {
    ...defaultOptions,
    ...options,
  } as Options<Datum>;

  let attrs = { class: className };
  let text: (datum: Datum, index?: number, outerIndex?: number) => string = (
    node: Datum
  ) => '';
  let styles = {};

  let el: Selection<Datum>;
  const anchor = root || d3.select('body');
  const rootNode = anchor.node();

  function tip(selection: Selection<Datum>) {
    selection.on('mouseover.tip', (node) => {
      const [mouseX, mouseY] = d3.mouse(rootNode);
      const [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

      anchor.selectAll(`div.${className}`).remove();

      el = anchor
        .append('div')
        .attr(prependClass(className)(attrs))
        .style({
          position: 'absolute',
          'z-index': 1001,
          left: `${x}px`,
          top: `${y}px`,
          ...styles,
        })
        .html(() => text(node)) as Selection<Datum>;
    });

    selection.on('mousemove.tip', (node) => {
      const [mouseX, mouseY] = d3.mouse(rootNode);
      const [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

      el.style({
        left: `${x}px`,
        top: `${y}px`,
      }).html(() => text(node));
    });

    selection.on('mouseout.tip', () => el.remove());
  }

  tip.attr = function setAttr(
    this: typeof tip,
    d:
      | string
      | {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }
  ) {
    if (is(Object, d)) {
      attrs = {
        ...attrs,
        ...(d as {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }),
      };
    }
    return this;
  };

  tip.style = function setStyle(
    this: typeof tip,
    d:
      | string
      | {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }
      | undefined
  ) {
    if (is(Object, d)) {
      styles = {
        ...styles,
        ...(d as {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }),
      };
    }
    return this;
  };

  tip.text = function setText(
    this: typeof tip,
    d: string | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) {
    text = functor(d);
    return this;
  };

  return tip;
}
