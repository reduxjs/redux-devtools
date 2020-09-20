import d3Package, { Primitive, Selection } from 'd3';
import { is } from 'ramda';
import utils from './utils';
const { prependClass, functor } = utils;

const defaultOptions = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: { left: 0, top: 0 },
  root: undefined,
};

export default function tooltip<Datum>(
  d3: typeof d3Package,
  className = 'tooltip',
  options = {}
) {
  const { left, top, offset, root } = { ...defaultOptions, ...options };

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
        .html(() => text(node));
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
    d:
      | string
      | {
          [key: string]:
            | Primitive
            | ((datum: Datum, index: number, outerIndex: number) => Primitive);
        }
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
    d: string | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) {
    text = functor(d);
    return this;
  };

  return tip;
}
