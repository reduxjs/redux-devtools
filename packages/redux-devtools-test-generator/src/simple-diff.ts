declare module 'simple-diff' {
  interface AddEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'add';
    oldValue: undefined;
    newValue: unknown;
  }

  interface RemoveEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'remove';
    oldValue: unknown;
    newValue: undefined;
  }

  interface ChangeEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'change';
    oldValue: unknown;
    newValue: unknown;
  }

  interface AddItemEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'add-item';
    oldIndex: -1;
    curIndex: -1;
    newIndex: number;
    newValue: unknown;
  }

  interface RemoveItemEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'remove-item';
    oldIndex: number;
    curIndex: number;
    newIndex: -1;
    oldValue: unknown;
  }

  interface MoveItemEvent {
    oldPath: (string | number)[];
    newPath: (string | number)[];
    type: 'move-item';
    oldIndex: number;
    curIndex: number;
    newIndex: number;
  }

  export type Event =
    | AddEvent
    | RemoveEvent
    | ChangeEvent
    | AddItemEvent
    | RemoveItemEvent
    | MoveItemEvent;

  export default function (oldObj: unknown, newObj: unknown): Event[];
}
