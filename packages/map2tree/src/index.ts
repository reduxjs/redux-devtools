import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import mapValues from 'lodash/mapValues';

interface Node {
  name: string;
  children?: Node[];
  value?: unknown;
}

function visit(
  parent: Node,
  visitFn: (parent: Node) => void,
  childrenFn: (parent: Node) => Node[] | undefined
) {
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

function getNode(tree: Node, key: string): Node | null {
  let node = null;

  visit(
    tree,
    (d) => {
      if (d.name === key) {
        node = d;
      }
    },
    (d) => d.children
  );

  return node;
}

export default function map2tree(
  // eslint-disable-next-line @typescript-eslint/ban-types
  root: {},
  options: { key?: string; pushMethod?: 'push' | 'unshift' } = {},
  tree: Node = { name: options.key || 'state', children: [] }
): Node {
  // eslint-disable-next-line @typescript-eslint/ban-types
  if (!isPlainObject(root) && root && !(root as { toJS: () => {} }).toJS) {
    return {} as Node;
  }

  const { key: rootNodeKey = 'state', pushMethod = 'push' } = options;
  const currentNode = getNode(tree, rootNodeKey);

  if (currentNode === null) {
    return {} as Node;
  }

  mapValues(
    // eslint-disable-next-line @typescript-eslint/ban-types
    root && (root as { toJS: () => {} }).toJS
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        (root as { toJS: () => {} }).toJS()
      : root,
    // eslint-disable-next-line @typescript-eslint/ban-types
    (maybeImmutable: { toJS?: () => {} }, key) => {
      const value =
        maybeImmutable && maybeImmutable.toJS
          ? maybeImmutable.toJS()
          : maybeImmutable;
      const newNode: Node = { name: key };

      if (isArray(value)) {
        newNode.children = [];

        for (let i = 0; i < value.length; i++) {
          newNode.children[pushMethod]({
            name: `${key}[${i}]`,
            [isPlainObject(value[i]) ? 'object' : 'value']: value[i],
          });
        }
      } else if (isPlainObject(value)) {
        newNode.children = [];
      } else {
        newNode.value = value;
      }

      currentNode.children![pushMethod](newNode);

      map2tree(value, { key, pushMethod }, tree);
    }
  );

  return tree;
}
