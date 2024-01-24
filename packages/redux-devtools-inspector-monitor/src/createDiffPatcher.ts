import { DiffPatcher } from 'jsondiffpatch';
import type { DiffContext } from 'jsondiffpatch';

const defaultObjectHash = (obj: object, idx: number | undefined) => {
  const o = obj as Record<string, unknown>;
  return (
    (o === null && '$$null') ||
    (o && (o.id || o.id === 0) && `$$id:${JSON.stringify(o.id)}`) ||
    (o && (o._id || o._id === 0) && `$$_id:${JSON.stringify(o._id)}`) ||
    `$$index:${idx}`
  );
};

const defaultPropertyFilter = (name: string, context: DiffContext) =>
  typeof (context.left as Record<string, unknown>)[name] !== 'function' &&
  typeof (context.right as Record<string, unknown>)[name] !== 'function';

const defaultDiffPatcher = new DiffPatcher({
  arrays: { detectMove: false } as {
    detectMove: boolean;
    includeValueOnMove: boolean;
  },
  objectHash: defaultObjectHash,
  propertyFilter: defaultPropertyFilter,
});

export default function createDiffPatcher(
  objectHash:
    | ((item: unknown, index: number | undefined) => string)
    | undefined,
  propertyFilter: ((name: string, context: DiffContext) => boolean) | undefined,
) {
  if (!objectHash && !propertyFilter) {
    return defaultDiffPatcher;
  }

  return new DiffPatcher({
    arrays: { detectMove: false } as {
      detectMove: boolean;
      includeValueOnMove: boolean;
    },
    objectHash: objectHash || defaultObjectHash,
    propertyFilter: propertyFilter || defaultPropertyFilter,
  });
}
