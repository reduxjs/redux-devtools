// Include this script in Chrome apps and extensions for remote debugging
// <script src="chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/redux-devtools-extension.bundle.js"></script>

import { Options } from '../options/syncOptions';

window.devToolsExtensionID = 'lmhkpmbekcpmknklioeibfkpmmfibljd';
require('./contentScript');
require('./pageScript');

chrome.runtime.sendMessage(
  window.devToolsExtensionID,
  { type: 'GET_OPTIONS' },
  function (response: { readonly options: Options }) {
    if (!response.options.inject) {
      const urls = response.options.urls.split('\n').filter(Boolean).join('|');
      if (!location.href.match(new RegExp(urls))) return;
    }

    window.devToolsOptions = response.options;
    window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors();
  }
);
