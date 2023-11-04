import { Action } from 'redux';
import type { PageScriptToContentScriptMessage } from './index';

export type Position = 'left' | 'right' | 'bottom' | 'panel' | 'remote';

function post<S, A extends Action<string>>(
  message: PageScriptToContentScriptMessage<S, A>,
) {
  window.postMessage(message, '*');
}

export default function openWindow(position?: Position) {
  post({
    source: '@devtools-page',
    type: 'OPEN',
    position: position || 'right',
  });
}
