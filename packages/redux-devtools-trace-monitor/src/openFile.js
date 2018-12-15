function openResource(fileName, lineNumber, stackFrame) {
  const adjustedLineNumber = Math.max(lineNumber - 1, 0);
  chrome.devtools.panels.openResource(fileName, adjustedLineNumber, (result) => {
    //console.log("openResource callback args: ", callbackArgs);
    if(result.isError) {
      const {fileName: finalFileName, lineNumber: finalLineNumber} = stackFrame;
      const adjustedLineNumber = Math.max(finalLineNumber - 1, 0);
      chrome.devtools.panels.openResource(finalFileName, adjustedLineNumber, (result) => {
      // console.log("openResource result: ", result);
      });
    }
  });
}

function openInEditor(editor, path, stackFrame) {
  const projectPath = path.replace(/\/$/, '');
  const file = stackFrame._originalFileName || stackFrame.finalFileName || stackFrame.fileName || '';
  const filePath = /^https?:\/\//.test(file) ? file.replace(/^https?:\/\/[^\/]*/, '') : file.replace(/^\w+:\/\//, '');
  const line = stackFrame._originalLineNumber || stackFrame.lineNumber || '0';
  const column = stackFrame._originalColumnNumber || stackFrame.columnNumber || '0';
  let url;

  switch (editor) {
    case 'vscode': case 'code':
      url = `vscode://file/${projectPath}${filePath}:${line}:${column}`; break;
    case 'atom':
      url = `atom://core/open/file?filename=${projectPath}${filePath}&line=${line}&column=${column}`; break;
    case 'webstorm': case 'phpstorm': case 'idea':
      url = `${editor}://open?file=${projectPath}${filePath}&line=${line}&column=${column}`; break;
    default: // sublime, emacs, macvim, textmate + custom like https://github.com/eclemens/atom-url-handler
      url = `${editor}://open/?url=file://${projectPath}${filePath}&line=${line}&column=${column}`;
  }
  if (process.env.NODE_ENV === 'development') console.log(url); // eslint-disable-line no-console
  window.open(url);
}

export default function openFile(fileName, lineNumber, stackFrame) {
  if (process.env.NODE_ENV === 'development') console.log(fileName, lineNumber, stackFrame); // eslint-disable-line no-console
  if (!chrome || !chrome.storage || !chrome.storage.sync) return; // TODO: Pass editor settings for using outside of browser extension
  if (chrome && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(['useEditor', 'editor', 'projectPath'], function({ useEditor, editor, projectPath }) {
      if (useEditor && projectPath && typeof editor === 'string' && /^\w{1,30}$/.test(editor)) {
        openInEditor(editor, projectPath, stackFrame);
      } else {
        if (chrome.devtools && chrome.devtools.panels && chrome.devtools.panels.openResource) {
          openResource(fileName, lineNumber, stackFrame);
        } else if (chrome.runtime && chrome.runtime.openOptionsPage) {
          if (confirm('Set the editor to open the file in?')) {
            chrome.runtime.openOptionsPage();
          }
        }
      }
    });  
  }
}
