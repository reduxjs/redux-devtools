import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from '@redux-devtools/app';

chrome.storage.local.get(
  {
    'select-monitor': 'InspectorMonitor',
    'test-templates': null,
    'test-templates-sel': null,
    's:hostname': null,
    's:port': null,
    's:secure': null,
  },
  (options) => {
    const AppAsAny = Root as any;
    const root = createRoot(document.getElementById('root')!);
    root.render(
      <AppAsAny
        selectMonitor={options['select-monitor']}
        testTemplates={options['test-templates']}
        selectedTemplate={options['test-templates-sel']}
        useCodemirror
        socketOptions={
          options['s:hostname'] && options['s:port']
            ? {
                hostname: options['s:hostname'],
                port: options['s:port'],
                secure: options['s:secure'],
              }
            : undefined
        }
      />,
    );
  },
);
