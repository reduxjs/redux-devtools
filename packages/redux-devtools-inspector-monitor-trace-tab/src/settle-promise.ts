declare module 'settle-promise' {
  export function settle(promises: Promise<void>[]): Promise<void>;
}
