import React from 'react';
import { render } from 'react-dom';
import { Root } from '../src';

render(<Root />, document.getElementById('root'));

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
