import React from 'react';

export default ({ options, saveOption }) => {
  const AllowToRunState = {
    EVERYWHERE: true,
    ON_SPECIFIC_URLS: false
  };

  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Allow to run</legend>

      <div className="option option_type_radio">
        <input className="option__element"
               id="inject-always"
               name="inject"
               type="radio"
               checked={options.inject === AllowToRunState.EVERYWHERE}
               onChange={() => saveOption('inject', AllowToRunState.EVERYWHERE)}/>
        <label className="option__label" htmlFor="inject-always">Everywhere</label>
      </div>

      <div className="option option_type_radio">
        <input className="option__element"
               id="inject-specific"
               name="inject"
               type="radio"
               checked={options.inject === AllowToRunState.ON_SPECIFIC_URLS}
               onChange={() => saveOption('inject', AllowToRunState.ON_SPECIFIC_URLS)}/>
        <label className="option__label" htmlFor="inject-specific">Only on the following URLs:</label>
        <br/>
        <textarea className="option__textarea"
                  value={options.urls}
                  disabled={options.inject !== AllowToRunState.ON_SPECIFIC_URLS}
                  onChange={(e) => saveOption('urls', e.target.value)} />
        <div className="option__hint">Each RegExp from the new line</div>
      </div>
    </fieldset>
  );
};
