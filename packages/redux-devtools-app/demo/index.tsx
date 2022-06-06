import React from 'react';
import { createRoot } from 'react-dom/client';
import { Root } from '../src';

const root = createRoot(document.getElementById('root')!);
root.render(<Root />);

if (module.hot) {
  // https://github.com/webpack/webpack/issues/418#issuecomment-53398056
  module.hot.accept((err) => {
    if (err) console.error(err.message); // eslint-disable-line no-console
  });

  /*
    module.hot.accept('./app', () => {
      const NextApp = require('./app').default;
      render(
        <NextApp />,
        document.getElementById('root')
      );
    });
   */
}
