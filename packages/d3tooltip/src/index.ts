import d3Package, {
  BaseType,
  ContainerElement,
  Primitive,
  Selection,
} from 'd3';
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

type StyleValue = string | number | boolean;

interface Tip<
  GElement extends ContainerElement,
  Datum,
  PElement extends BaseType,
  PDatum
> {
  (selection: Selection<GElement, Datum, PElement, PDatum>): void;
  // TODO Do we need to support functions or `null`?
  style: (this: this, value: { [key: string]: StyleValue }) => this;
  text: (
    this: this,
    d: string | ((datum: Datum, index?: number, outerIndex?: number) => string)
  ) => this;
}

export function tooltip<
  GElement extends ContainerElement,
  Datum,
  PElement extends BaseType,
  PDatum
>(
  d3: typeof d3Package,
  className = 'tooltip',
  options: Partial<Options<GElement, Datum, PElement, PDatum>> = {}
): Tip<GElement, Datum, PElement, PDatum> {
  const { left, top, offset, root } = {
    ...defaultOptions,
    ...options,
  } as Options<GElement, Datum, PElement, PDatum>;

  let text: (
    datum: Datum,
    index?: number,
    outerIndex?: number
  ) => string = () => '';
  let styles = {};

  let el: Selection<HTMLDivElement, Datum, BaseType, PDatum>;
  const anchor: Selection<GElement, Datum, BaseType, PDatum> =
    root || d3.select('body');
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
        .style('top', `${y}px`);

      for (const [key, value] of Object.entries(styles)) {
        el = el.style(key, value as StyleValue);
      }

      el = el.html(() => text(node));
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
