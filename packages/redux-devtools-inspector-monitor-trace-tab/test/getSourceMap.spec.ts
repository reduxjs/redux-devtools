import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  decodeInlineSourceMap,
  getSourceMap,
  resolveSourceMapUrl,
} from '../src/react-error-overlay/utils/getSourceMap.js';

const rawMap = {
  version: 3,
  sources: ['src/index.ts'],
  names: [],
  mappings: 'AAAA',
  sourcesContent: ['export const a = 1;'],
};

describe('resolveSourceMapUrl', () => {
  it('resolves a relative map name against the bundle URL', () => {
    expect(
      resolveSourceMapUrl(
        'bundle.js.map',
        'http://localhost:3000/static/js/bundle.js',
      ),
    ).toBe('http://localhost:3000/static/js/bundle.js.map');
  });

  it('keeps an absolute map URL instead of concatenating it onto the bundle path', () => {
    expect(
      resolveSourceMapUrl(
        'http://localhost:8081/index.map?platform=web',
        'http://localhost:8081/node_modules/expo/index.bundle',
      ),
    ).toBe('http://localhost:8081/index.map?platform=web');
  });

  it('resolves parent-directory and root-relative map names', () => {
    expect(
      resolveSourceMapUrl(
        '../maps/bundle.js.map',
        'http://h/static/js/bundle.js',
      ),
    ).toBe('http://h/static/maps/bundle.js.map');
    expect(
      resolveSourceMapUrl(
        '/maps/bundle.js.map',
        'http://h/static/js/bundle.js',
      ),
    ).toBe('http://h/maps/bundle.js.map');
  });

  it('falls back to path concatenation when the bundle URI is not a valid URL', () => {
    expect(resolveSourceMapUrl('a.js.map', 'no-scheme/dir/a.js')).toBe(
      'no-scheme/dir/a.js.map',
    );
  });
});

describe('decodeInlineSourceMap', () => {
  it('decodes base64 inline maps', () => {
    const encoded = `data:application/json;charset=utf-8;base64,${btoa(JSON.stringify(rawMap))}`;
    expect(decodeInlineSourceMap(encoded)).toEqual(rawMap);
  });

  it('decodes percent-encoded inline maps', () => {
    const encoded = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(rawMap))}`;
    expect(decodeInlineSourceMap(encoded)).toEqual(rawMap);
  });
});

describe('getSourceMap', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the map from the URL resolved against the bundle', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => rawMap,
    }));
    vi.stubGlobal('fetch', fetchMock);

    const map = await getSourceMap(
      'http://h/static/js/bundle.js',
      'var a = 1;\n//# sourceMappingURL=bundle.js.map',
    );

    expect(fetchMock).toHaveBeenCalledWith('http://h/static/js/bundle.js.map');
    expect(map.getSources()).toEqual(['src/index.ts']);
  });

  it('reports a failed fetch instead of parsing an error page', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      })),
    );

    await expect(
      getSourceMap('http://h/bundle.js', '//# sourceMappingURL=missing.map'),
    ).rejects.toThrow('404');
  });
});
