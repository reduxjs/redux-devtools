declare module 'es6template' {
  const _default: {
    compile<Locals>(template: string): (locals: Locals) => string;
  };
  export default _default;
}
