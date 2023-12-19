import { isArray, isPlainObject, mapValues } from 'lodash-es';

export interface Node {
  name: string;
  children?: this[];
  object?: unknown;
  value?: unknown;
}

function visit(
  parent: Node,
  visitFn: (parent: Node) => void,
  childrenFn: (parent: Node) => Node[] | undefined | null,
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
    (d) => d.children,
  );

  return node;
}

export function map2tree(
  root: unknown,
  options: { key?: string; pushMethod?: 'push' | 'unshift' } = {},
  tree: Node = { name: options.key || 'state', children: [] },
  // eslint-disable-next-line @typescript-eslint/ban-types
): Node | {} {
  // eslint-disable-next-line @typescript-eslint/ban-types
  if (!isPlainObject(root) && root && !(root as { toJS: () => {} }).toJS) {
    return {};
  }

  const { key: rootNodeKey = 'state', pushMethod = 'push' } = options;
  const currentNode = getNode(tree, rootNodeKey);

  if (currentNode === null) {
    return {};
  }

  mapValues(
    // eslint-disable-next-line @typescript-eslint/ban-types
    root && (root as { toJS: () => {} }).toJS
      ? // eslint-disable-next-line @typescript-eslint/ban-types
        (root as { toJS: () => {} }).toJS()
      : // eslint-disable-next-line @typescript-eslint/ban-types
        (root as {}),
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
    },
  );

  return tree;
}
