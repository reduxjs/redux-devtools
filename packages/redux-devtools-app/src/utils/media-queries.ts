/**
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
 */
export function prefersDarkColorScheme(): boolean {
  if (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
  ) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  return false;
}
