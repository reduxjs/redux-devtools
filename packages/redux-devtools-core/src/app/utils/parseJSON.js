import jsan from 'jsan';
import { DATA_TYPE_KEY, DATA_REF_KEY } from '../constants/dataTypes';

export function reviver(key, value) {
  if (
    typeof value === 'object' && value !== null &&
    '__serializedType__' in value && typeof value.data === 'object'
  ) {
    const data = value.data;
    data[DATA_TYPE_KEY] = value.__serializedType__;
    if ('__serializedRef__' in value) data[DATA_REF_KEY] = value.__serializedRef__;
    /*
    if (Array.isArray(data)) {
      data.__serializedType__ = value.__serializedType__;
    } else {
      Object.defineProperty(data, '__serializedType__', {
        value: value.__serializedType__
      });
    }
    */
    return data;
  }
  return value;
}

export default function parseJSON(data, serialize) {
  if (typeof data !== 'string') return data;
  try {
    return serialize ? jsan.parse(data, reviver) : jsan.parse(data);
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') console.error(data + 'is not a valid JSON', e);
    return undefined;
  }
}
