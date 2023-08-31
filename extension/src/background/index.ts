import '../chromeApiMock';
import { Store } from 'redux';
import configureStore, { BackgroundAction } from './store/backgroundStore';
import openDevToolsWindow, { DevToolsPosition } from './openWindow';
import { createMenu, removeMenu } from './contextMenus';
import syncOptions from '../options/syncOptions';
import { BackgroundState } from './store/backgroundReducer';

declare global {
  interface Window {
    store: Store<BackgroundState, BackgroundAction>;
  }
}

// Expose the extension's store globally to access it from the windows
// via chrome.runtime.getBackgroundPage
window.store = configureStore();

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener((shortcut) => {
  openDevToolsWindow(shortcut as DevToolsPosition);
});

// Create the context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  syncOptions().get((option) => {
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
