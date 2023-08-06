import { DiffContext, DiffPatcher } from 'jsondiffpatch';

const defaultObjectHash = (o: any, idx: number) =>
  (o === null && '$$null') ||
  (o && (o.id || o.id === 0) && `$$id:${JSON.stringify(o.id)}`) ||
  (o && (o._id || o._id === 0) && `$$_id:${JSON.stringify(o._id)}`) ||
  `$$index:${idx}`;

const defaultPropertyFilter = (name: string, context: DiffContext) =>
  typeof context.left[name] !== 'function' &&
  typeof context.right[name] !== 'function';

const defaultDiffPatcher = new DiffPatcher({
  arrays: { detectMove: false } as {
    detectMove: boolean;
    includeValueOnMove: boolean;
  },
  objectHash: defaultObjectHash,
  propertyFilter: defaultPropertyFilter,
});

export default function createDiffPatcher(
  objectHash: ((item: unknown, index: number) => string) | undefined,
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
