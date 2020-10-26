import configureStore from '../../../app/stores/backgroundStore';
import openDevToolsWindow from './openWindow';
import { createMenu, removeMenu } from './contextMenus';
import syncOptions from '../options/syncOptions';

// Expose the extension's store globally to access it from the windows
// via chrome.runtime.getBackgroundPage
window.store = configureStore();

// Listen for keyboard shortcuts
chrome.commands.onCommand.addListener(shortcut => {
  openDevToolsWindow(shortcut);
});

// Create the context menu when installed
chrome.runtime.onInstalled.addListener(() => {
  syncOptions().get(option => {
    if (option.showContextMenus) createMenu();
  });
});

// Create or Remove context menu when config changed
chrome.storage.onChanged.addListener(changes => {
  if (changes.showContextMenus) {
    if (changes.showContextMenus.newValue) createMenu();
    else removeMenu();
  }
});
