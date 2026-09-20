export type DevToolsPosition = 'devtools-window' | 'devtools-remote';

const windows: { [K in DevToolsPosition]?: number } = {};

export default function openDevToolsWindow(position: DevToolsPosition) {
  if (!windows[position]) {
    createWindow(position);
  } else {
    chrome.windows.update(windows[position], { focused: true }, () => {
      if (chrome.runtime.lastError) createWindow(position);
    });
  }
}

function createWindow(position: DevToolsPosition) {
  const url = chrome.runtime.getURL(getPath(position));
  chrome.windows.create({ type: 'popup', url }, (win) => {
    windows[position] = win!.id;
    if (navigator.userAgent.includes('Firefox')) {
      void chrome.windows.update(win!.id!, { focused: true });
    }
  });
}

function getPath(position: DevToolsPosition) {
  switch (position) {
    case 'devtools-window':
      return 'devpanel.html';
    case 'devtools-remote':
      return 'remote.html';
    default:
      throw new Error('Unrecognized position');
  }
}
