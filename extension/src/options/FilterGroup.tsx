import React from 'react';
import { FilterState } from '../pageScript/api/filters';
import { OptionsProps } from './Options';

export default function FilterGroup({ options, saveOption }: OptionsProps) {
  return (
    <fieldset className="option-group">
      <legend className="option-group__title">
        Filter actions in DevTools
      </legend>

      <div className="option option_type_radio">
        <input
          className="option__element"
          id="filter-do-not"
          name="filter"
          type="radio"
          checked={options.filter === FilterState.DO_NOT_FILTER}
          onChange={() => saveOption('filter', FilterState.DO_NOT_FILTER)}
        />
        <label className="option__label" htmlFor="filter-do-not">
          Don’t filter
        </label>
      </div>

      <div className="option option_type_radio">
        <input
          className="option__element"
          id="filter-hide"
          name="filter"
          type="radio"
          checked={options.filter === FilterState.DENYLIST_SPECIFIC}
          onChange={() => saveOption('filter', FilterState.DENYLIST_SPECIFIC)}
        />
        <label className="option__label" htmlFor="filter-hide">
          Hide the following:
        </label>
        <br />
        <textarea
          className="option__textarea"
          value={options.denylist}
          disabled={options.filter !== FilterState.DENYLIST_SPECIFIC}
          onChange={(e) => saveOption('denylist', e.target.value)}
        />
        <div className="option__hint">Each action from the new line</div>
      </div>

      <div className="option option_type_radio">
        <input
          className="option__element"
          id="filter-show"
          name="filter"
          type="radio"
          checked={options.filter === FilterState.ALLOWLIST_SPECIFIC}
          onChange={() => saveOption('filter', FilterState.ALLOWLIST_SPECIFIC)}
        />
        <label className="option__label" htmlFor="filter-show">
          Show the following:
        </label>
        <br />
        <textarea
          className="option__textarea"
          value={options.allowlist}
          disabled={options.filter !== FilterState.ALLOWLIST_SPECIFIC}
          onChange={(e) => saveOption('allowlist', e.target.value)}
        />
        <div className="option__hint">Each action from the new line</div>
      </div>
    </fieldset>
  );
}
