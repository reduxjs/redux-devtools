import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import type { ViewUpdate } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { useTheme } from '@emotion/react';
import type { ThemeFromProvider } from '../utils/theme';

import '../../fonts/index.css';

export interface EditorProps {
  value?: string;
  lineNumbers?: boolean;
  readOnly?: boolean;
  foldGutter?: boolean;
  autofocus?: boolean;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
}

export default function Editor({
  value = '',
  lineNumbers = true,
  readOnly = false,
  foldGutter = true,
  autofocus = false,
  onChange,
}: EditorProps) {
  const theme = useTheme() as ThemeFromProvider;

  const myTheme =
    theme.scheme === 'default' && theme.light
      ? undefined
      : createTheme({
          theme: theme.light ? 'light' : 'dark',
          settings: {
            background: theme.base00,
            foreground: theme.base04,
            selection: theme.base01,
            selectionMatch: 'transparent',
            gutterBackground: theme.base01,
            gutterForeground: theme.base05,
            gutterBorder: 'transparent',
            gutterActiveForeground: theme.base05,
            lineHighlight: 'transparent',
          },
          styles: [],
        });

  return (
    <CodeMirror
      value={value}
      theme={myTheme}
      extensions={[javascript()]}
      onChange={onChange}
      readOnly={readOnly}
      autoFocus={autofocus}
      basicSetup={{
        lineNumbers,
        foldGutter,
      }}
    />
  );
}
