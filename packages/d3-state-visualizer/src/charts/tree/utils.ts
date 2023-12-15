import { is, join, pipe, replace } from 'ramda';
import sortAndSerialize from './sortAndSerialize.js';
import type { InternalNode } from './tree.js';

export function collapseChildren(node: InternalNode) {
  if (node.children) {
    node._children = node.children;
    node._children.forEach(collapseChildren);
    node.children = undefined;
  }
}

export function expandChildren(node: InternalNode) {
  if (node._children) {
    node.children = node._children;
    node.children.forEach(expandChildren);
    node._children = undefined;
  }
}

export function toggleChildren(node: InternalNode) {
  if (node.children) {
    node._children = node.children;
    node.children = undefined;
  } else if (node._children) {
    node.children = node._children;
    node._children = undefined;
  }
  return node;
}

export function visit(
  parent: InternalNode,
  visitFn: (parent: InternalNode) => void,
  childrenFn: (parent: InternalNode) => InternalNode[] | null | undefined,
) {
  if (!parent) {
    return;
  }

  visitFn(parent);

  const children = childrenFn(parent);
  if (children) {
    const count = children.length;

    for (let i = 0; i < count; i++) {
      visit(children[i], visitFn, childrenFn);
    }
  }
}

export function getNodeGroupByDepthCount(rootNode: InternalNode) {
  const nodeGroupByDepthCount = [1];

  const traverseFrom = function traverseFrom(node: InternalNode, depth = 0) {
    if (!node.children || node.children.length === 0) {
      return 0;
    }

    if (nodeGroupByDepthCount.length <= depth + 1) {
      nodeGroupByDepthCount.push(0);
    }

    nodeGroupByDepthCount[depth + 1] += node.children.length;

    node.children.forEach((childNode) => {
      traverseFrom(childNode, depth + 1);
    });
  };

  traverseFrom(rootNode);
  return nodeGroupByDepthCount;
}

export function getTooltipString(node: InternalNode, { indentationSize = 4 }) {
  if (!is(Object, node)) return '';

  const spacer = join('&nbsp;&nbsp;');
  const cr2br = replace(/\n/g, '<br/>');
  const spaces2nbsp = replace(/\s{2}/g, spacer(new Array(indentationSize)));
  const json2html = pipe(sortAndSerialize, cr2br, spaces2nbsp);

  const children = node.children || node._children;

  if (typeof node.value !== 'undefined') return json2html(node.value);
  if (typeof node.object !== 'undefined') return json2html(node.object);
  if (children && children.length) return `childrenCount: ${children.length}`;
  return 'empty';
}
