/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

function isInternalFile(
  sourceFileName: string | null | undefined,
  fileName: string | null | undefined,
) {
  return (
    sourceFileName == null ||
    sourceFileName === '' ||
    sourceFileName.indexOf('/~/') !== -1 ||
    sourceFileName.indexOf('/node_modules/') !== -1 ||
    sourceFileName.trim().indexOf(' ') !== -1 ||
    fileName == null ||
    fileName === ''
  );
}

export { isInternalFile };
