export type Position = 'left' | 'right' | 'bottom' | 'panel' | 'remote';

export default function openWindow(position?: Position) {
  window.postMessage(
    {
      source: '@devtools-page',
      type: 'OPEN',
      position: position || 'right',
    },
    '*'
  );
}
