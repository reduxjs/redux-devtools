import { is } from 'ramda';
import utils from './utils';
const { prependClass, functor } = utils.default || utils;

const defaultOptions = {
  left: undefined, // mouseX
  top: undefined, // mouseY
  offset: {left: 0, top: 0},
  root: undefined
};

export default function tooltip(d3, className = 'tooltip', options = {}) {
  const {
    left,
    top,
    offset,
    root
    } = {...defaultOptions, ...options};

  let attrs = {'class': className};
  let text = () => '';
  let styles = {};

  let el;
  const anchor = root || d3.select('body');
  const rootNode = anchor.node();

  function tip(selection) {
    selection.on({
      'mouseover.tip': node => {
        let [mouseX, mouseY] = d3.mouse(rootNode);
        let [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

        anchor.selectAll(`div.${className}`).remove();

        el = anchor.append('div')
          .attr(prependClass(className)(attrs))
          .style({
            position: 'absolute',
            'z-index': 1001,
            left: x + 'px',
            top: y + 'px',
            ...styles
          })
          .html(() => text(node));
      },

      'mousemove.tip': node => {
        let [mouseX, mouseY] = d3.mouse(rootNode);
        let [x, y] = [left || mouseX + offset.left, top || mouseY - offset.top];

        el
          .style({
            left: x + 'px',
            top: y + 'px'
          })
          .html(() => text(node));
      },

      'mouseout.tip': () => el.remove()
    });
  }

  tip.attr = function setAttr(d) {
    if (is(Object, d)) {
      attrs = {...attrs, ...d};
    }
    return this;
  };

  tip.style = function setStyle(d) {
    if (is(Object, d)) {
      styles = {...styles, ...d};
    }
    return this;
  };

  tip.text = function setText(d) {
    text = functor(d);
    return this;
  };

  return tip;
}
