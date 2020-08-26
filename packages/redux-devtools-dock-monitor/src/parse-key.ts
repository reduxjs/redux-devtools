declare module 'parse-key' {
  interface KeyObject {
    name: string;
    ctrl: boolean;
    meta: boolean;
    shift: boolean;
    alt: boolean;
    sequence: string;
  }

  export default function parse(s: string): KeyObject;
}
