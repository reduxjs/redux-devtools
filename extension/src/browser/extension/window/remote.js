import React from 'react';
import { render } from 'react-dom';
import App from 'remotedev-app';

chrome.storage.local.get({
  'select-monitor': 'InspectorMonitor',
  'test-templates': null,
  'test-templates-sel': null,
  's:hostname': null,
  's:port': null,
  's:secure': null
}, options => {
  render(
    <App
      selectMonitor={options['select-monitor']}
      testTemplates={options['test-templates']}
      selectedTemplate={options['test-templates-sel']}
      testTemplates={options['test-templates']}
      useCodemirror
      socketOptions={
        options['s:hostname'] && options['s:port'] ?
          {
            hostname: options['s:hostname'], port: options['s:port'], secure: options['s:secure']
          } : undefined
      }
    />,
    document.getElementById('root')
  );
});
