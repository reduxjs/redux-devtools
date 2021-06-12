// https://stackoverflow.com/a/9310752
export function escapeRegExpSpecialCharacter(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
