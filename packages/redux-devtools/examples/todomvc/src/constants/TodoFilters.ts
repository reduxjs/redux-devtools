export const SHOW_ALL = 'show_all';
export const SHOW_MARKED = 'show_marked';
export const SHOW_UNMARKED = 'show_unmarked';

export type TodoFilter =
  | typeof SHOW_ALL
  | typeof SHOW_MARKED
  | typeof SHOW_UNMARKED;
