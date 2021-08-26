import React from 'react';
import { render } from 'react-dom';
import OptionsComponent from './Options';
import { Options } from './syncOptions';

import '../../views/options.pug';

chrome.runtime.getBackgroundPage((background) => {
  const syncOptions = background!.syncOptions;

  const saveOption = <K extends keyof Options>(name: K, value: Options[K]) => {
    syncOptions.save(name, value);
  };

  const renderOptions = (options: Options) => {
    render(
      <OptionsComponent options={options} saveOption={saveOption} />,
      document.getElementById('root')
    );
  };

  syncOptions.subscribe(renderOptions);
  syncOptions.get((options) => {
    renderOptions(options);
  });
});
