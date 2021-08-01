import { TabOption } from '../types';

export function isTabVisible<St, Props, Vis extends string>(
  tab: TabOption<St, Props, Vis>,
  visKey: Vis | 'default'
): boolean {
  if (typeof tab.visible === 'boolean') {
    return tab.visible;
  }

  if (typeof tab.visible === 'object' && tab.visible) {
    return !!tab.visible[visKey];
  }

  return true;
}
