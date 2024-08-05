/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { StackFrame } from './stack-frame';
import { parse } from './parser';
import { map } from './mapper';
import { unmap } from './unmapper';
import { toExclude } from '../../presets';

function getStackFrames(
  error: Error,
  unhandledRejection = false, // eslint-disable-line no-unused-vars
  contextSize = 3,
): Promise<StackFrame[] | null> {
  const parsedFrames = parse(error);
  let enhancedFramesPromise;
  if (
    (
      error as unknown as {
        __unmap_source: string | { uri: string; contents: string };
      }
    ).__unmap_source
  ) {
    enhancedFramesPromise = unmap(
      // $FlowFixMe
      (
        error as unknown as {
          __unmap_source: string | { uri: string; contents: string };
        }
      ).__unmap_source,
      parsedFrames,
      contextSize,
    );
  } else {
    enhancedFramesPromise = map(parsedFrames, contextSize);
  }
  return enhancedFramesPromise.then((enhancedFrames) => {
    /*
    if (
      enhancedFrames
        .map(f => f._originalFileName)
        .filter(f => f != null && f.indexOf('node_modules') === -1).length === 0
    ) {
      return null;
    }
    */
    return enhancedFrames.filter(
      ({ functionName, fileName }) =>
        (functionName == null ||
          !functionName.includes('__stack_frame_overlay_proxy_console__')) &&
        !toExclude.test(fileName!),
    );
  });
}

export default getStackFrames;
export { getStackFrames };
