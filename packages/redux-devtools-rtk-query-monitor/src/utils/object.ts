import { freeze } from '@reduxjs/toolkit';

export const emptyArray = freeze([]);

export const emptyRecord = freeze({});

export function identity<T>(val: T): T {
  return val;
}
