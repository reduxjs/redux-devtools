export default function(obj) {
  if (obj !== null && typeof obj === 'object' && typeof obj[Symbol.iterator] === 'function') {
    return 'Iterable';
  }
  return Object.prototype.toString.call(obj).slice(8, -1);
}
