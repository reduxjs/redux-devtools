import '../chromeApiMock';
import React from 'react';
import { createRoot } from 'react-dom/client';
import OptionsComponent from './Options';
import {
  getOptions,
  Options,
  OptionsMessage,
  saveOption,
  subscribeToOptions,
} from './syncOptions';

subscribeToOptions((options) => {
  const message: OptionsMessage = { type: 'OPTIONS', options };
  void chrome.runtime.sendMessage(message);
});

const renderOptions = (options: Options) => {
  const root = createRoot(document.getElementById('root')!);
  root.render(<OptionsComponent options={options} saveOption={saveOption} />);
};

subscribeToOptions(renderOptions);
getOptions((options) => {
  renderOptions(options);
});
