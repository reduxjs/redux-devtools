/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { RawSourceMap, SourceMapConsumer } from 'source-map';

/**
 * A wrapped instance of a <code>{@link https://github.com/mozilla/source-map SourceMapConsumer}</code>.
 *
 * This exposes methods which will be indifferent to changes made in <code>{@link https://github.com/mozilla/source-map source-map}</code>.
 */
export class SourceMap {
  __source_map: SourceMapConsumer;

  constructor(sourceMap: SourceMapConsumer) {
    this.__source_map = sourceMap;
  }

  /**
   * Returns the original code position for a generated code position.
   * @param {number} line The line of the generated code position.
   * @param {number} column The column of the generated code position.
   */
  getOriginalPosition(
    line: number,
    column: number,
  ): { source: string | null; line: number | null; column: number | null } {
    const {
      line: l,
      column: c,
      source: s,
    } = this.__source_map.originalPositionFor({
      line,
      column,
    });
    return { line: l, column: c, source: s };
  }

  /**
   * Returns the generated code position for an original position.
   * @param {string} source The source file of the original code position.
   * @param {number} line The line of the original code position.
   * @param {number} column The column of the original code position.
   */
  getGeneratedPosition(
    source: string,
    line: number,
    column: number,
  ): { line: number | null; column: number | null } {
    const { line: l, column: c } = this.__source_map.generatedPositionFor({
      source,
      line,
      column,
    });
    return {
      line: l,
      column: c,
    };
  }

  /**
   * Returns the code for a given source file name.
   * @param {string} sourceName The name of the source file.
   */
  getSource(sourceName: string): string | null {
    return this.__source_map.sourceContentFor(sourceName);
  }

  getSources(): string[] {
    return (this.__source_map as unknown as { sources: string[] }).sources;
  }
}

export function extractSourceMapUrl(
  fileUri: string,
  fileContents: string,
): Promise<string> {
  const regex = /\/\/[#@] ?sourceMappingURL=([^\s'"]+)\s*$/gm;
  let match = null;
  for (;;) {
    const next = regex.exec(fileContents);
    if (next == null) {
      break;
    }
    match = next;
  }
  if (!(match && match[1])) {
    return Promise.reject(
      new Error(`Cannot find a source map directive for ${fileUri}.`),
    );
  }
  return Promise.resolve(match[1].toString());
}

export function resolveSourceMapUrl(
  sourceMapUrl: string,
  fileUri: string,
): string {
  try {
    return new URL(sourceMapUrl, fileUri).href;
  } catch {
    const index = fileUri.lastIndexOf('/');
    return fileUri.substring(0, index + 1) + sourceMapUrl;
  }
}

export function decodeInlineSourceMap(dataUrl: string): RawSourceMap {
  const comma = dataUrl.indexOf(',');
  if (comma === -1) {
    throw new Error('Malformed inline source map data URL.');
  }
  const header = dataUrl.substring('data:'.length, comma);
  const payload = dataUrl.substring(comma + 1);
  const isBase64 = header.split(';').includes('base64');
  const json = isBase64 ? window.atob(payload) : decodeURIComponent(payload);
  return JSON.parse(json) as RawSourceMap;
}

/**
 * Returns an instance of <code>{@link SourceMap}</code> for a given fileUri and fileContents.
 * @param {string} fileUri The URI of the source file.
 * @param {string} fileContents The contents of the source file.
 */
export async function getSourceMap(
  fileUri: string,
  fileContents: string,
): Promise<SourceMap> {
  const sm = await extractSourceMapUrl(fileUri, fileContents);
  if (sm.startsWith('data:')) {
    return new SourceMap(new SourceMapConsumer(decodeInlineSourceMap(sm)));
  }
  const url = resolveSourceMapUrl(sm, fileUri);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch source map ${url} (${res.status} ${res.statusText}).`,
    );
  }
  const obj = (await res.json()) as RawSourceMap;
  return new SourceMap(new SourceMapConsumer(obj));
}

export default getSourceMap;
