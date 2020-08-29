interface SerializedImmutableMap {
  data: Record<string, unknown>;
  __serializedType__: 'ImmutableMap';
}

interface SerializedImmutableOrderedMap {
  data: Record<string, unknown>;
  __serializedType__: 'ImmutableOrderedMap';
}

interface SerializedImmutableList {
  data: unknown[];
  __serializedType__: 'ImmutableList';
}

interface SerializedImmutableRangeData {
  _start: number | undefined;
  _end: number | undefined;
  _step: number | undefined;
}
interface SerializedImmutableRange {
  data: SerializedImmutableRangeData;
  __serializedType__: 'ImmutableRange';
}

interface SerializedImmutableRepeatData {
  _value: unknown;
  size: number | undefined;
}
interface SerializedImmutableRepeat {
  data: SerializedImmutableRepeatData;
  __serializedType__: 'ImmutableRepeat';
}

interface SerializedImmutableSet {
  data: unknown[];
  __serializedType__: 'ImmutableSet';
}

interface SerializedImmutableOrderedSet {
  data: unknown[];
  __serializedType__: 'ImmutableOrderedSet';
}

interface SerializedImmutableSeq {
  data: unknown[];
  __serializedType__: 'ImmutableSeq';
}

interface SerializedImmutableStack {
  data: unknown[];
  __serializedType__: 'ImmutableStack';
}

interface SerializedImmutableRecord {
  data: Record<string, unknown>;
  __serializedType__: 'ImmutableRecord';
  __serializedRef__?: number;
}

export type SerializedImmutableData =
  | SerializedImmutableMap
  | SerializedImmutableOrderedMap
  | SerializedImmutableList
  | SerializedImmutableRange
  | SerializedImmutableRepeat
  | SerializedImmutableSet
  | SerializedImmutableOrderedSet
  | SerializedImmutableSeq
  | SerializedImmutableStack
  | SerializedImmutableRecord;
