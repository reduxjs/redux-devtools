// Chrome's port message limit is 64 MiB. Strings are measured in UTF-16 code
// units here while Chrome measures serialized bytes, so keep a 2x margin.
export const maxChromeMsgSize = 32 * 1024 * 1024;

const sizeLimitErrorPattern = /maximum allowed (length|size)/i;

export function isMessageSizeError(err: unknown): boolean {
  const message =
    typeof err === 'object' && err !== null && 'message' in err
      ? String(err.message)
      : String(err);
  return sizeLimitErrorPattern.test(message);
}

export function stringFieldsLength(message: object): number {
  let size = 0;
  for (const value of Object.values(message)) {
    if (typeof value === 'string') size += value.length;
  }
  return size;
}

export function exceedsChromeMsgSize(message: object): boolean {
  return stringFieldsLength(message) > maxChromeMsgSize;
}

export interface SplitMessageParts {
  readonly start: Record<string, unknown>;
  readonly chunks: readonly [string, string][];
}

/**
 * Splits a flat message into a `start` object holding every field that fits
 * under `maxChromeMsgSize`, plus `[key, piece]` chunks for the string fields
 * that did not. The receiver concatenates chunks by key onto `start`.
 */
export function splitMessage(message: object): SplitMessageParts {
  const start: Record<string, unknown> = { split: 'start' };
  const chunks: [string, string][] = [];
  let size = 0;
  for (const [key, value] of Object.entries(message)) {
    if (typeof value === 'string') {
      size += value.length;
      if (size > maxChromeMsgSize) {
        for (let j = 0; j < value.length; j += maxChromeMsgSize) {
          chunks.push([key, value.substring(j, j + maxChromeMsgSize)]);
        }
        continue;
      }
    }
    start[key] = value;
  }
  return { start, chunks };
}
