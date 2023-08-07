import { StateFilterValue } from '@redux-devtools/ui/lib/types/StateFilter/StateFilter';
import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';

type Path = string[];

const _filterByPaths = (obj: any, paths: Path[]) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (paths.length === 1 && !paths[0].length) return obj;

  // groupBy top level key and,
  // remove that key from grouped path values
  // [['a', 'b'], ['a', 'c']] => {'a': ['b', 'c']}
  const groupedTopPaths = _.mapValues(_.groupBy(paths, 0), (val) =>
    val.map((v) => v.slice(1))
  );
  const topKeys = Object.keys(groupedTopPaths);

  if (Array.isArray(obj)) {
    obj = obj.flatMap((_, i) =>
      i in groupedTopPaths ? _filterByPaths(obj[i], groupedTopPaths[i]) : []
    );
    return obj;
  }
  if (typeof obj === 'object') obj = _.pick(obj, topKeys);

  for (const k of topKeys) {
    if (!(k in obj)) continue;
    obj[k] = _filterByPaths(obj[k], groupedTopPaths[k]);
  }
  return obj;
};

const filterByPaths = (obj: any, paths: Path[]) => {
  const sortedUniqPaths = _.sortBy(_.uniqBy(paths, JSON.stringify), ['length']);
  // remove unnecessary depths
  // [['a'], ['a', 'b']] => [['a']]
  const filteredPaths = sortedUniqPaths.filter((s, i, arr) => {
    if (i === 0) return true;
    if (!_.isEqual(arr[i].slice(0, arr[i - 1].length), arr[i - 1])) return true;
    return false;
  });
  return _filterByPaths(obj, filteredPaths);
};

export const filterByJsonPath = (obj: any, jsonpath: string) => {
  const paths = JSONPath({
    json: obj,
    path: jsonpath,
    resultType: 'path',
    eval: 'safe',
  }).map((jp: string) => JSONPath.toPathArray(jp).slice(1)) as Path[];

  if (paths.some((path: Path) => !path.length)) return obj;

  const result = filterByPaths(obj, paths);

  return result;
};

export type FilterType = 'jsonpath' | 'regexp-glob';
export type FilterResult = [any, Error | null];

export const filter = (
  obj: any,
  stateFilter: StateFilterValue
): FilterResult => {
  try {
    const { isJsonPath, searchString } = stateFilter;
    if (!searchString) return [obj, null];

    if (isJsonPath) return [filterByJsonPath(obj, searchString), null];
    else return [filterByJsonPath(obj, `$..${searchString}`), null];
  } catch (error) {
    console.error('Filter Error', error);
    return [{}, error as Error];
  }
};
