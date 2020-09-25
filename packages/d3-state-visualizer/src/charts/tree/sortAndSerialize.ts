function sortObject(obj: unknown, strict?: boolean) {
  if (obj instanceof Array) {
    let ary;
    if (strict) {
      ary = obj.sort();
    } else {
      ary = obj;
    }
    return ary;
  }

  if (obj && typeof obj === 'object') {
    const tObj: { [key: string]: unknown } = {};
    Object.keys(obj)
      .sort()
      .forEach((key) => (tObj[key] = sortObject(obj[key as keyof typeof obj])));
    return tObj;
  }

  return obj;
}

export default function sortAndSerialize(obj: unknown) {
  return JSON.stringify(sortObject(obj, true), undefined, 2);
}
