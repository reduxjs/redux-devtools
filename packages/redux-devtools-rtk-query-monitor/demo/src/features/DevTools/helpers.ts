import { isExtensionEnabledKey } from './config';

export function isExtensionEnabled(): boolean {
  let extensionEnabled = false;

  try {
    extensionEnabled =
      window.sessionStorage.getItem(isExtensionEnabledKey) === '1';
  } catch (err) {
    console.error(err);
  }

  return extensionEnabled;
}

export function setIsExtensionEnabled(active: boolean): void {
  try {
    window.sessionStorage.setItem(isExtensionEnabledKey, active ? '1' : '0');
  } catch (err) {
    console.error(err);
  }
}
