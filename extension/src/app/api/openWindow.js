export default function openWindow(position) {
  window.postMessage({
    source: '@devtools-page',
    type: 'OPEN',
    position: position || 'right'
  }, '*');
}
