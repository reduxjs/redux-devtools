import React from 'react';
import { render } from 'react-dom';
import Options from './Options';

chrome.runtime.getBackgroundPage(background => {
  const syncOptions = background.syncOptions;

  const saveOption = (name, value) => {
    syncOptions.save(name, value);
  };

  const renderOptions = options => {
    render(
      <Options options={options} saveOption={saveOption} />,
      document.getElementById('root')
    );
  };

  syncOptions.subscribe(renderOptions);
  syncOptions.get(options => {
    renderOptions(options);
  });
});
