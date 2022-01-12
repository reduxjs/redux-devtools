export default function getSymbolObservable() {
  return (typeof Symbol === 'function' && Symbol.observable) || '@@observable';
}
