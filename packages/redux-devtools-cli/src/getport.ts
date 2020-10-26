declare module 'getport' {
  export default function getport(
    start: number,
    callback: (e: Error | undefined, port: number) => void
  ): void;
}
