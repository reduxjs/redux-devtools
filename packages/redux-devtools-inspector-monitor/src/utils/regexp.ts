// https://stackoverflow.com/a/9310752
export function escapeRegExpSpecialCharacter(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * ```ts
 * const entries = ['a', 'b', 'c', 'd.'];
 *
 * oneOfGroup(entries) // returns "(a|b|c|d\\.)"
 * ```
 * @param onOf
 * @returns
 */
export function oneOfGroup(onOf: string[]): string {
  return `(${onOf.map(escapeRegExpSpecialCharacter).join('|')})`;
}
