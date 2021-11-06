const objectKeys =
  Object.keys ||
  function (obj) {
    const keys = [];
    for (const key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) keys.push(key);
    }
    return keys;
  };

export default function assign(obj: {}, newKey, newValue) {
  const keys = objectKeys(obj);
  const copy = {};

  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    copy[key] = obj[key];
  }

  copy[newKey] = newValue;
  return copy;
}
