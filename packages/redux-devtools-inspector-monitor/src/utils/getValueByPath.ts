export function getValueByPath(obj: any, path: (string | number)[]) {
  let current: any = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    const adjustedKey =
      typeof key === 'string' && !isNaN(Number(key)) ? parseInt(key, 10) : key;
    if (current[adjustedKey] === undefined) {
      return undefined;
    }
    current = current[adjustedKey];
  }
  return current;
}
