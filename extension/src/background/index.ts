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
  chrome.action.disable();

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
