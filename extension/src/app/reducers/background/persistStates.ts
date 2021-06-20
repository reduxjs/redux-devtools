export default function persistStates(state = false, action) {
  if (action.type === 'TOGGLE_PERSIST') return !state;
  return state;
}
