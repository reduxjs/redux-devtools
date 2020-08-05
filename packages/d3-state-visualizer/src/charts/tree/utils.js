import { is, join, pipe, replace } from 'ramda';
import sortAndSerialize from './sortAndSerialize';

export function collapseChildren(node) {
  if (node.children) {
    node._children = node.children;
    node._children.forEach(collapseChildren);
    node.children = null;
  }
}

export function expandChildren(node) {
  if (node._children) {
    node.children = node._children;
    node.children.forEach(expandChildren);
    node._children = null;
  }
}

export function toggleChildren(node) {
  if (node.children) {
    node._children = node.children;
    node.children = null;
  } else if (node._children) {
    node.children = node._children;
    node._children = null;
  }
  return node;
}

export function visit(parent, visitFn, childrenFn) {
  if (!parent) {
    return;
  }

  visitFn(parent);

  let children = childrenFn(parent);
  if (children) {
    let count = children.length;

    for (let i = 0; i < count; i++) {
      visit(children[i], visitFn, childrenFn);
    }
  }
}

export function getNodeGroupByDepthCount(rootNode) {
  let nodeGroupByDepthCount = [1];

  const traverseFrom = function traverseFrom(node, depth = 0) {
    if (!node.children || node.children.length === 0) {
      return 0;
    }

    if (nodeGroupByDepthCount.length <= depth + 1) {
      nodeGroupByDepthCount.push(0);
    }

    nodeGroupByDepthCount[depth + 1] += node.children.length;

    node.children.forEach(childNode => {
      traverseFrom(childNode, depth + 1);
    });
  };

  traverseFrom(rootNode);
  return nodeGroupByDepthCount;
}

export function getTooltipString(node, i, { indentationSize = 4 }) {
  if (!is(Object, node)) return '';

  const spacer = join('&nbsp;&nbsp;');
  const cr2br = replace(/\n/g, '<br/>');
  const spaces2nbsp = replace(/\s{2}/g, spacer(new Array(indentationSize)));
  const json2html = pipe(sortAndSerialize, cr2br, spaces2nbsp);

  const children = node.children || node._children;

  if (typeof node.value !== 'undefined') return json2html(node.value);
  if (typeof node.object !== 'undefined') return json2html(node.object);
  if (children && children.length) return 'childrenCount: ' + children.length;
  return 'empty';
}
