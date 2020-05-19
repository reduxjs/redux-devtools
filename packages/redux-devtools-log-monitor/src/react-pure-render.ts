declare module 'react-pure-render/function' {
  export default function shouldPureComponentUpdate(
    nextProps: unknown,
    nextState: unknown
  ): boolean;
}
