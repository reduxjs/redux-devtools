import jsan from 'jsan';
import { DATA_TYPE_KEY, DATA_REF_KEY } from '../constants/dataTypes';

function replacer(key: string, value: unknown) {
  if (typeof value === 'object' && value !== null && DATA_TYPE_KEY in value) {
    const __serializedType__ = (value as any)[DATA_TYPE_KEY];
    const clone = { ...value };
    delete (clone as any)[DATA_TYPE_KEY]; // eslint-disable-line no-param-reassign
    const r = { data: clone, __serializedType__ };
    if (DATA_REF_KEY in value)
      (r as any).__serializedRef__ = (clone as any)[DATA_REF_KEY];
    return r;
  }
  return value;
}

export function stringifyJSON(data: unknown, serialize: boolean | undefined) {
  return serialize
    ? jsan.stringify(data, replacer, null as unknown as undefined, true)
    : jsan.stringify(data);
}
