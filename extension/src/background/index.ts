import '../chromeApiMock';
import configureStore from './store/backgroundStore';
import openDevToolsWindow, { DevToolsPosition } from './openWindow';
import { createMenu, removeMenu } from './contextMenus';
import { getOptions } from '../options/syncOptions';

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
    else removeMenu();
  }
});

// https://developer.chrome.com/docs/extensions/develop/migrate/to-service-workers#keep_a_service_worker_alive_continuously
setInterval(
  () =>
    void chrome.storage.local.set({ 'last-heartbeat': new Date().getTime() }),
  20000,
);
