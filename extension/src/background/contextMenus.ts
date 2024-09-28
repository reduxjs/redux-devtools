import openDevToolsWindow, { DevToolsPosition } from './openWindow';

export function createMenu() {
  const menus = [
    { id: 'devtools-window', title: 'Open in a window' },
    { id: 'devtools-remote', title: 'Open Remote DevTools' },
  ];

  const shortcuts: { [commandName: string]: string | undefined } = {};
  chrome.commands.getAll((commands) => {
    for (const { name, shortcut } of commands) {
      shortcuts[name!] = shortcut;
    }

    for (const { id, title } of menus) {
      chrome.contextMenus.create({
        id: id,
        title: title + (shortcuts[id] ? ' (' + shortcuts[id] + ')' : ''),
        contexts: ['all'],
      });
    }
  });
}

export function removeMenu() {
  chrome.contextMenus.removeAll();
}

chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
  openDevToolsWindow(menuItemId as DevToolsPosition);
});
