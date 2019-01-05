import jsan from 'jsan';
import { DATA_TYPE_KEY, DATA_REF_KEY } from '../constants/dataTypes';

function replacer(key, value) {
  if (typeof value === 'object' && value !== null && DATA_TYPE_KEY in value) {
    const __serializedType__ = value[DATA_TYPE_KEY];
    delete value[DATA_TYPE_KEY]; // eslint-disable-line no-param-reassign
    const r = { data: value, __serializedType__ };
    if (DATA_REF_KEY in value) r.__serializedRef__ = value[DATA_REF_KEY];
    return r;
  }
  return value;
}

export default function stringifyJSON(data, serialize) {
  return serialize ? jsan.stringify(data, replacer, null, true) : jsan.stringify(data);
}
