export interface SerializedData {
  data: unknown;
  __serializedType__: string;
  __serializedRef__?: number;
}

export function mark(data: unknown, type: string): SerializedData;
export function mark<K extends string>(
  data: { [key in K]: () => unknown },
  type: string,
  transformMethod?: K | false,
): SerializedData;
export function mark<K extends string>(
  data: any,
  type: string,
  transformMethod?: 'toString' | false,
): SerializedData;
export function mark<K extends string>(
  data: { [key in K]: () => unknown } | unknown,
  type: string,
  transformMethod?: K | false,
): SerializedData {
  return {
    data: transformMethod
      ? (data as { [key in K]: () => unknown })[transformMethod]()
      : data,
    __serializedType__: type,
  };
}

export function extract(data: unknown, type: string): SerializedData {
  return {
    data: Object.assign({}, data),
    __serializedType__: type,
  };
}

export function refer(data: unknown, type: string): SerializedData;
export function refer<K extends string>(
  data: { [key in K]: () => unknown },
  type: string,
  transformMethod?: K | false,
  refs?: (new (data: any) => unknown)[] | null,
): SerializedData;
export function refer<K extends string>(
  data: any,
  type: string,
  transformMethod?: 'toString' | false,
  refs?: (new (data: any) => unknown)[] | null,
): SerializedData;
export function refer<K extends string>(
  data: { [key in K]: () => unknown } | unknown,
  type: string,
  transformMethod?: K | false,
  refs?: (new (data: any) => unknown)[] | null,
): SerializedData {
  const r = mark(data as { [key in K]: () => unknown }, type, transformMethod);
  if (!refs) return r;
  for (let i = 0; i < refs.length; i++) {
    const ref = refs[i];
    if (typeof ref === 'function' && data instanceof ref) {
      r.__serializedRef__ = i;
      return r;
    }
  }
  return r;
}
