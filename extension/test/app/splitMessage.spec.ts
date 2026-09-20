import { describe, expect, it } from 'vitest';
import {
  exceedsChromeMsgSize,
  isMessageSizeError,
  maxChromeMsgSize,
  splitMessage,
} from '../../src/utils/splitMessage.js';

describe('isMessageSizeError', () => {
  it('matches the wording used before and after Chrome 149', () => {
    expect(
      isMessageSizeError(
        new Error('Message length exceeded maximum allowed length.'),
      ),
    ).toBe(true);
    expect(
      isMessageSizeError(
        new Error('Message exceeded maximum allowed size of 64MiB.'),
      ),
    ).toBe(true);
  });

  it('rejects unrelated errors', () => {
    expect(
      isMessageSizeError(
        new Error('Attempting to use a disconnected port object'),
      ),
    ).toBe(false);
    expect(isMessageSizeError(undefined)).toBe(false);
    expect(isMessageSizeError('boom')).toBe(false);
  });
});

describe('exceedsChromeMsgSize', () => {
  it('sums only string fields', () => {
    expect(
      exceedsChromeMsgSize({ a: 'x'.repeat(maxChromeMsgSize), b: 42 }),
    ).toBe(false);
    expect(
      exceedsChromeMsgSize({
        a: 'x'.repeat(maxChromeMsgSize),
        b: 'y',
      }),
    ).toBe(true);
  });
});

describe('splitMessage', () => {
  it('keeps small fields on the start message and chunks the oversized one', () => {
    const big = 'a'.repeat(maxChromeMsgSize * 2 + 10);
    const message = {
      type: 'ACTION',
      instanceId: 7,
      action: '{"type":"X"}',
      payload: big,
      maxAge: 50,
    };

    const { start, chunks } = splitMessage(message);

    expect(start).toEqual({
      split: 'start',
      type: 'ACTION',
      instanceId: 7,
      action: '{"type":"X"}',
      maxAge: 50,
    });
    expect(chunks.map(([key, piece]) => [key, piece.length])).toEqual([
      ['payload', maxChromeMsgSize],
      ['payload', maxChromeMsgSize],
      ['payload', 10],
    ]);

    const rebuilt: Record<string, unknown> = { ...start };
    for (const [key, piece] of chunks) {
      rebuilt[key] = ((rebuilt[key] as string | undefined) ?? '') + piece;
    }
    delete rebuilt.split;
    expect(rebuilt).toEqual(message);
  });

  it('moves every later string field into chunks once the running total is over the limit', () => {
    const message = {
      actionsById: 'a'.repeat(maxChromeMsgSize),
      computedStates: 'b'.repeat(5),
      committedState: false,
    };
    const { start, chunks } = splitMessage(message);
    expect(start).toEqual({
      split: 'start',
      actionsById: message.actionsById,
      committedState: false,
    });
    expect(chunks).toEqual([['computedStates', 'bbbbb']]);
  });
});
