import StackFrame from './react-error-overlay/utils/stack-frame';

const isFF = navigator.userAgent.includes('Firefox');

function openResource(
  fileName: string,
  lineNumber: number,
  stackFrame: StackFrame,
) {
  const adjustedLineNumber = Math.max(lineNumber - 1, 0);
  chrome.devtools.panels.openResource(fileName, adjustedLineNumber, ((result: {
    isError?: boolean;
  }) => {
    //console.log("openResource callback args: ", callbackArgs);
    if (result.isError) {
      const { fileName: finalFileName, lineNumber: finalLineNumber } =
        stackFrame;
      const adjustedLineNumber = Math.max(finalLineNumber! - 1, 0);
      chrome.devtools.panels.openResource(
        finalFileName!,
        adjustedLineNumber,
        (/* result */) => {
          // console.log("openResource result: ", result);
        },
      );
    }
  }) as () => void);
}

function openAndCloseTab(url: string) {
  chrome.tabs.create({ url }, (tab) => {
    const removeTab = () => {
      chrome.windows.onFocusChanged.removeListener(removeTab);
      if (tab && tab.id) {
        chrome.tabs.remove(tab.id, async () => {
          // eslint-disable-next-line no-console
          if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
          else if (chrome.devtools && chrome.devtools.inspectedWindow) {
            await chrome.tabs.update(chrome.devtools.inspectedWindow.tabId, {
              active: true,
            });
          }
        });
      }
    };
    if (chrome.windows) chrome.windows.onFocusChanged.addListener(removeTab);
  });
}

function openInIframe(url: string) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  setTimeout(() => iframe.parentNode!.removeChild(iframe), 3000);
}

function openInEditor(editor: string, path: string, stackFrame: StackFrame) {
  const projectPath = path.replace(/\/$/, '');
  const file =
    stackFrame._originalFileName ||
    (stackFrame as unknown as { finalFileName: string }).finalFileName ||
    stackFrame.fileName ||
    '';
  let filePath = /^https?:\/\//.test(file)
    ? file.replace(/^https?:\/\/[^/]*/, '')
    : file.replace(/^\w+:\/\//, '');
  filePath = filePath.replace(/^\/~\//, '/node_modules/');
  const line = stackFrame._originalLineNumber || stackFrame.lineNumber || '0';
  const column =
    stackFrame._originalColumnNumber || stackFrame.columnNumber || '0';
  let url;

  switch (editor) {
    case 'vscode':
    case 'code':
      url = `vscode://file/${projectPath}${filePath}:${line}:${column}`;
      break;
    case 'atom':
      url = `atom://core/open/file?filename=${projectPath}${filePath}&line=${line}&column=${column}`;
      break;
    case 'webstorm':
    case 'phpstorm':
    case 'idea':
      url = `${editor}://open?file=${projectPath}${filePath}&line=${line}&column=${column}`;
      break;
    default:
      // sublime, emacs, macvim, textmate + custom like https://github.com/eclemens/atom-url-handler
      url = `${editor}://open/?url=file://${projectPath}${filePath}&line=${line}&column=${column}`;
  }
  if (chrome.devtools && !isFF) {
    if (chrome.tabs) openAndCloseTab(url);
    else window.open(url);
  } else {
    openInIframe(url);
  }
}

export default function openFile(
  fileName: string,
  lineNumber: number,
  stackFrame: StackFrame,
) {
  if (!chrome || !chrome.storage) return; // TODO: Pass editor settings for using outside of browser extension
  const storage = isFF
    ? chrome.storage.local
    : chrome.storage.sync || chrome.storage.local;
  storage.get(
    ['useEditor', 'editor', 'projectPath'],
    function ({ useEditor, editor, projectPath }) {
      if (
        useEditor &&
        projectPath &&
        typeof editor === 'string' &&
        /^\w{1,30}$/.test(editor)
      ) {
        openInEditor(editor.toLowerCase(), projectPath as string, stackFrame);
      } else {
        if (
          chrome.devtools &&
          chrome.devtools.panels &&
          !!chrome.devtools.panels.openResource
        ) {
          openResource(fileName, lineNumber, stackFrame);
        } else if (chrome.runtime && (chrome.runtime.openOptionsPage || isFF)) {
          if (chrome.devtools && isFF) {
            chrome.devtools.inspectedWindow.eval(
              'confirm("Set the editor to open the file in?")',
              (result) => {
                if (!result) return;
                void chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
              },
            );
          } else if (confirm('Set the editor to open the file in?')) {
            void chrome.runtime.openOptionsPage();
          }
        }
      }
    },
  );
}
