export default function isIterable(obj: unknown): boolean {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    typeof (obj as any)[window.Symbol.iterator] === 'function'
  );
}
