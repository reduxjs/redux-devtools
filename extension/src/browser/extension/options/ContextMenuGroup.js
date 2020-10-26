import React from 'react';

export default ({ options, saveOption }) => {
  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Context Menu</legend>

      <div className="option option_type_checkbox">
        <input className="option__element"
               id="showContextMenus"
               type="checkbox"
               checked={options.showContextMenus}
               onChange={(e) => saveOption('showContextMenus', e.target.checked)}/>
        <label className="option__label" htmlFor="showContextMenus">Add Context Menus</label>
        <div className="option__hint">
          Add Redux DevTools to right-click context menu
        </div>
      </div>
    </fieldset>
  );
};
