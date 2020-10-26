import React from 'react';

export default ({ options, saveOption }) => {
  const browserName = navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Chrome';

  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Miscellaneous</legend>

      <div className="option option_value_max-age">
        <label className="option__label" htmlFor="maxAge">Limit the action history to</label>
        {' '}
        <input className="option__element"
               id="maxAge"
               type="number"
               min="2"
               value={options.maxAge}
               onChange={(e) => saveOption('maxAge', Number(e.target.value))}/>
        {' '}
        <label className="option__label" htmlFor="maxAge">items</label>
        <div className="option__hint">
          When the number is reached, DevTools start removing the oldest actions. Improves the DevTools performance.
          {' '}
          <a href="https://github.com/zalmoxisus/redux-devtools-extension/pull/54#issuecomment-188167725">More info</a>
        </div>
      </div>

      <div className="option option_type_checkbox">
        <input className="option__element"
               id="notifyErrors"
               type="checkbox"
               checked={options.shouldCatchErrors}
               onChange={(e) => saveOption('shouldCatchErrors', e.target.checked)}/>
        <label className="option__label" htmlFor="notifyErrors">Show errors</label>
        <div className="option__hint">
          Show the {browserName} notifications when errors occur in the app
        </div>
      </div>
    </fieldset>
  );
};
