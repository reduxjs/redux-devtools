import { afterEach, describe, expect, it, vi } from 'vitest';
import openFile from '../src/openFile.js';
import StackFrame from '../src/react-error-overlay/utils/stack-frame.js';

const frame = new StackFrame('fn', 'http://localhost:3000/app.js', 72, 24);

describe('openFile outside the extension', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('does not throw when the chrome global is missing and opens the file URL', () => {
    expect(typeof chrome).toBe('undefined');
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    expect(() =>
      openFile('http://localhost:3000/app.js', 72, frame),
    ).not.toThrow();
    expect(open).toHaveBeenCalledWith('http://localhost:3000/app.js', '_blank');
  });

  it('does not open non-http file names', () => {
    const open = vi.spyOn(window, 'open').mockImplementation(() => null);
    openFile('webpack:///src/app.js', 72, frame);
    expect(open).not.toHaveBeenCalled();
  });
});
