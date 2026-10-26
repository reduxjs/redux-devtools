import { listSchemes, schemes } from '../src/utils/theme.js';

describe('listSchemes', () => {
  it('lists every color scheme', () => {
    expect(listSchemes()).toEqual(Object.keys(schemes).sort());
  });

  it('includes the first base16 scheme', () => {
    expect(listSchemes()).toContain('threezerotwofour');
  });
});
