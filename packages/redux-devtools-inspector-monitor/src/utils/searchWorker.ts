import { SearchQuery } from '../searchPanel/SearchPanel';

type PrimitiveValue = string | number | boolean | undefined | null;
export type Value =
  | PrimitiveValue
  | Value[]
  | { [key: string | number]: Value };

function getKeys(object: Value): string[] {
  if (object === undefined || object === null) {
    return [];
  }

  if (['string', 'number', 'boolean'].includes(typeof object)) {
    return [];
  }

  if (Array.isArray(object)) {
    return [...object.keys()].map((el) => el.toString());
  }

  return Object.keys(object);
}

function getKeyPaths(object: Value): string[] {
  const keys = getKeys(object) as (keyof object)[];
  const appendKey = (path: string, branch: string | number): string =>
    path ? `${path}.${branch}` : `${branch}`;

  return keys.flatMap((key) => [
    key,
    ...getKeyPaths(object?.[key]).map((subKey) => appendKey(key, subKey)),
  ]);
}

const isMatchable = (value: Value): boolean => {
  return (
    value === undefined ||
    value === null ||
    ['string', 'number', 'boolean'].includes(typeof value)
  );
};

function doSearch(objectToSearch: Value, query: SearchQuery): string[] {
  const {
    queryText,
    location: { keys: matchKeys, values: matchValues },
  } = query;

  if (!matchKeys && !matchValues) {
    return [];
  }

  const keyPaths = getKeyPaths(objectToSearch);
  const getValueFromKeyPath = (obj: Value, path: string): Value => {
    return path
      .split('.')
      .reduce(
        (intermediateObj, key) => intermediateObj?.[key as keyof object],
        obj
      );
  };
  const match = (value: Value, searchText: string): boolean => {
    return isMatchable(value) && String(value).includes(searchText);
  };

  return keyPaths.filter((keyPath) => {
    const valuesToCheck = [];
    matchKeys && valuesToCheck.push(keyPath.split('.').splice(-1)[0]);
    matchValues &&
      valuesToCheck.push(getValueFromKeyPath(objectToSearch, keyPath));

    return valuesToCheck.some((value) => match(value, queryText));
  });
}

self.onmessage = (
  event: MessageEvent<{ objectToSearch: Value; query: SearchQuery }>
) => {
  const { objectToSearch, query } = event.data;
  const result = doSearch(objectToSearch, query);
  self.postMessage(result);
};

export {};
