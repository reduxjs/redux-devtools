/**
 * Borrowed from `react-redux`.
 * @param {unknown} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 * @see https://github.com/reduxjs/react-redux/blob/2c7ef25a0704efcf10e41112d88ae9867e946d10/src/utils/isPlainObject.js
 */
export function isPlainObject(obj: unknown): obj is Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);

  if (proto === null) {
    return true;
  }

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
}

export function identity<T>(val: T): T {
  return val;
}
