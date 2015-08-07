export default function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}
