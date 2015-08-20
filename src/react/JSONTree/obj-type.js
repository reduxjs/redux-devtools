export default function(obj) {
  const type = Object.prototype.toString.call(obj).slice(8, -1);
  if (type === 'Object' && typeof obj[Symbol.iterator] === 'function') {
    return 'Iterable';
  }
  return type;
}
