import React from 'react';
import { OptionsProps } from './Options';

export default ({ options, saveOption }: OptionsProps) => {
  const EditorState = {
    BROWSER: 0,
    EXTERNAL: 1,
  };

  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Editor for stack traces</legend>

      <div className="option option_type_radio">
        <input
          className="option__element"
          id="editor-browser"
          name="useEditor"
          type="radio"
          checked={options.useEditor === EditorState.BROWSER}
          onChange={() => saveOption('useEditor', EditorState.BROWSER)}
        />
        <label className="option__label" htmlFor="editor-browser">
          {navigator.userAgent.indexOf('Firefox') !== -1
            ? "Don't open in external editor"
            : "Use browser's debugger (from Chrome devpanel only)"}
        </label>
      </div>

      <div
        className="option option_type_radio"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <input
          className="option__element"
          id="editor-external"
          name="useEditor"
          type="radio"
          checked={options.useEditor === EditorState.EXTERNAL}
          onChange={() => saveOption('useEditor', EditorState.EXTERNAL)}
        />
        <label className="option__label" htmlFor="editor-external">
          External editor:&nbsp;
        </label>
        <input
          className="option__element"
          id="editor"
          type="text"
          size={33}
          placeholder={'vscode://file/{path}:{line}:{column}'}
          value={options.editorURL}
          disabled={options.useEditor !== EditorState.EXTERNAL}
          onChange={(e) => saveOption('editorURL', e.target.value)}
        />
      </div>
    </fieldset>
  );
};
