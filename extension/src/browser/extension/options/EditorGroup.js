import React from 'react';

export default ({ options, saveOption }) => {
  const EditorState = {
    BROWSER: 0,
    EXTERNAL: 1
  };

  return (
    <fieldset className="option-group">
      <legend className="option-group__title">Editor for stack traces</legend>

      <div className="option option_type_radio">
        <input className="option__element"
               id="editor-browser"
               name="useEditor"
               type="radio"
               checked={options.useEditor === EditorState.BROWSER}
               onChange={() => saveOption('useEditor', EditorState.BROWSER)}/>
        <label className="option__label" htmlFor="editor-browser">{
          navigator.userAgent.indexOf('Firefox') !== -1 ?
            'Don\'t open in external editor' :
            'Use browser\'s debugger (from Chrome devpanel only)'
        }</label>
      </div>

      <div className="option option_type_radio" style={{ display: 'flex', alignItems: 'center' }}>
        <input className="option__element"
               id="editor-external"
               name="useEditor"
               type="radio"
               checked={options.useEditor === EditorState.EXTERNAL}
               onChange={() => saveOption('useEditor', EditorState.EXTERNAL)}/>
        <label className="option__label" htmlFor="editor-external">External editor:&nbsp;</label>
        <input className="option__element"
               id="editor"
               type="text"
               size="33"
               maxLength={30}
               placeholder="vscode, atom, webstorm, sublime..."
               value={options.editor}
               disabled={options.useEditor !== EditorState.EXTERNAL}
               onChange={(e) => saveOption('editor', e.target.value.replace(/\W/g, ''))}/>
      </div>
      <div className="option option_type_radio">
        <label className="option__label" htmlFor="editor-external" style={{marginLeft: '20px'}}>
          Absolute path to the project directory to open:
        </label>
        <br/>
        <textarea className="option__textarea"
                  placeholder="/home/user/my-awesome-app"
                  value={options.projectPath}
                  disabled={options.useEditor !== EditorState.EXTERNAL}
                  onChange={(e) => saveOption('projectPath', e.target.value.replace('\n', ''))} />
        <div className="option__hint">Run `pwd` in your project root directory to get it</div>
      </div>
    </fieldset>
  );
};
