export default function isIterable(obj: unknown): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    typeof (obj as Record<string | typeof Symbol.iterator, unknown>)[
      window.Symbol.iterator
    ] === 'function'
  );
}
