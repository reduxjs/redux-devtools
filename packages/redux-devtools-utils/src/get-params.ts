declare module 'get-params' {
  function getParams(func: (...args: any[]) => unknown): string[];
  export default getParams;
}
