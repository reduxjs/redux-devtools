import '../chromeApiMock.js';
import configureStore from './store/backgroundStore.js';
import openDevToolsWindow, { DevToolsPosition } from './openWindow.js';
import { createMenu, removeMenu } from './contextMenus.js';
import { getOptions } from '../options/syncOptions.js';

// Expose the extension's store globally to access it from the windows
// via chrome.runtime.getBackgroundPage
export const store = configureStore();

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((shortcut) => {
  openDevToolsWindow(shortcut as DevToolsPosition);
});

// Disable the action by default and create the context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  void chrome.action.disable();

  getOptions((option) => {
    if (option.showContextMenus) createMenu();
  });
});

// Create or Remove context menu when config changed
chrome.storage.onChanged.addListener((changes) => {
  if (changes.showContextMenus) {
    if (changes.showContextMenus.newValue) createMenu();
    else void removeMenu();
  }
});

// https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers#keep_a_service_worker_alive_continuously
setInterval(
  () =>
    void chrome.storage.local.set({ 'last-heartbeat': new Date().getTime() }),
  20000,
);
