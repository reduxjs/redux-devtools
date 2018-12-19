import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

function visit(parent, visitFn, childrenFn) {
  if (!parent) return;

  visitFn(parent);

  const children = childrenFn(parent);
  if (children) {
    const count = children.length;
    for (let i = 0; i < count; i++) {
      visit(children[i], visitFn, childrenFn);
    }
  }
}

function getNode(tree, key) {
  let node = null;

  visit(tree, d => {
    if (d.name === key) {
      node = d;
    }
  }, d => d.children);

  return node;
}

export default function map2tree(root, options = {}, tree = {name: options.key || 'state', children: []}) {
  if (!isPlainObject(root) && root && !root.toJS) {
    return {};
  }

  const { key: rootNodeKey = 'state', pushMethod = 'push' } = options;
  const currentNode = getNode(tree, rootNodeKey);

  if (currentNode === null) {
    return {};
  }

  mapValues(root && root.toJS ? root.toJS() : root, (maybeImmutable, key) => {
    const value = maybeImmutable && maybeImmutable.toJS ? maybeImmutable.toJS() : maybeImmutable;
    let newNode = {name: key};

    if (isArray(value)) {
      newNode.children = [];

      for (let i = 0; i < value.length; i++) {
        newNode.children[pushMethod]({
          name: `${key}[${i}]`,
          [isPlainObject(value[i]) ? 'object' : 'value']: value[i]
        });
      }
    } else if (isPlainObject(value)) {
      newNode.children = [];
    } else {
      newNode.value = value;
    }

    currentNode.children[pushMethod](newNode);

    map2tree(value, {key, pushMethod}, tree);
  });

  return tree;
}
