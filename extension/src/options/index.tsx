import '../chromeApiMock';
import React from 'react';
import { createRoot } from 'react-dom/client';
import OptionsComponent from './Options';
import { Options } from './syncOptions';

chrome.runtime.getBackgroundPage((background) => {
  const syncOptions = background!.syncOptions;

  const saveOption = <K extends keyof Options>(name: K, value: Options[K]) => {
    syncOptions.save(name, value);
  };

  const renderOptions = (options: Options) => {
    const root = createRoot(document.getElementById('root')!);
    root.render(<OptionsComponent options={options} saveOption={saveOption} />);
  };

  syncOptions.subscribe(renderOptions);
  syncOptions.get((options) => {
    renderOptions(options);
  });
});
