export const TOGGLE_VISIBILITY = '@@redux-devtools/dock/TOGGLE_VISIBILITY';
export function toggleVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

export const CHANGE_POSITION = '@@redux-devtools/dock/CHANGE_POSITION';
export function changePosition() {
  return { type: CHANGE_POSITION };
}

export const CHANGE_SIZE = '@@redux-devtools/dock/CHANGE_SIZE';
export function changeSize(size) {
  return { type: CHANGE_SIZE, size: size };
}
