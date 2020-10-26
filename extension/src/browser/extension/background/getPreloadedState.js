const getIfExists = (sel, template) => (
  typeof sel === 'undefined' ||
  typeof template === 'undefined' ||
  typeof template[sel] === 'undefined' ?
    0 : sel
);

export default function getPreloadedState(position, cb) {
  chrome.storage.local.get([
    'monitor' + position, 'slider' + position, 'dispatcher' + position,
    'test-templates', 'test-templates-sel'
  ], options => {
    cb({
      monitor: {
        selected: options['monitor' + position],
        sliderIsOpen: options['slider' + position] || false,
        dispatcherIsOpen: options['dispatcher' + position] || false,
      },
      test: {
        selected: getIfExists(options['test-templates-sel'], options['test-templates']),
        templates: options['test-templates']
      }
    });
  });
}
