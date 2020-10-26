import React from 'react';
import { FilterState } from '../../../app/api/filters';

export default ({ options, saveOption }) => {
  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Filter actions in DevTools</legend>

      <div className="option option_type_radio">
        <input className="option__element"
               id="filter-do-not"
               name="filter"
               type="radio"
               checked={options.filter === FilterState.DO_NOT_FILTER}
               onChange={() => saveOption('filter', FilterState.DO_NOT_FILTER)}/>
        <label className="option__label" htmlFor="filter-do-not">Don’t filter</label>
      </div>

      <div className="option option_type_radio">
        <input className="option__element"
               id="filter-hide"
               name="filter"
               type="radio"
               checked={options.filter === FilterState.BLACKLIST_SPECIFIC}
               onChange={() => saveOption('filter', FilterState.BLACKLIST_SPECIFIC)}/>
        <label className="option__label" htmlFor="filter-hide">Hide the following:</label>
        <br/>
        <textarea className="option__textarea"
                  value={options.blacklist}
                  disabled={options.filter !== FilterState.BLACKLIST_SPECIFIC}
                  onChange={(e) => saveOption('blacklist', e.target.value)} />
        <div className="option__hint">Each action from the new line</div>
      </div>

      <div className="option option_type_radio">
        <input className="option__element"
               id="filter-show"
               name="filter"
               type="radio"
               checked={options.filter === FilterState.WHITELIST_SPECIFIC}
               onChange={() => saveOption('filter', FilterState.WHITELIST_SPECIFIC)}/>
        <label className="option__label" htmlFor="filter-show">Show the following:</label>
        <br/>
        <textarea className="option__textarea"
                  value={options.whitelist}
                  disabled={options.filter !== FilterState.WHITELIST_SPECIFIC}
                  onChange={(e) => saveOption('whitelist', e.target.value)} />
        <div className="option__hint">Each action from the new line</div>
      </div>
    </fieldset>
  );
};
