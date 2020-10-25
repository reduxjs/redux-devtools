import stringifyJSON from '../utils/stringifyJSON';
import { UPDATE_STATE, LIFTED_ACTION, EXPORT } from '../constants/actionTypes';
import { getActiveInstance } from '../reducers/instances';
import { Dispatch, MiddlewareAPI } from 'redux';
import { ExportRequest, StoreAction } from '../actions';
import { StoreState } from '../reducers';

let toExport: string | undefined;

function download(state: string) {
  const blob = new Blob([state], { type: 'octet/stream' });
  const href = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = 'state.json';
  a.href = href;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(href);
  }, 0);
}

const exportState = (
  store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>
) => (next: Dispatch<StoreAction>) => (action: StoreAction) => {
  const result = next(action);

  if (
    toExport &&
    action.type === UPDATE_STATE &&
    action.request!.type === 'EXPORT'
  ) {
    const request = action.request!;
    const id = request.instanceId || request.id;
    if (id === toExport) {
      toExport = undefined;
      download(
        JSON.stringify(
          {
            payload: request.payload,
            preloadedState: (request as ExportRequest).committedState,
          },
          null,
          '\t'
        )
      );
    }
  } else if (action.type === EXPORT) {
    const instances = store.getState().instances;
    const instanceId = getActiveInstance(instances);
    const options = instances.options[instanceId];
    if (options.features.export === true) {
      download(stringifyJSON(instances.states[instanceId], options.serialize));
    } else {
      toExport = instanceId;
      next({ type: LIFTED_ACTION, message: 'EXPORT', toExport: true });
    }
  }
  return result;
};

export default exportState;
