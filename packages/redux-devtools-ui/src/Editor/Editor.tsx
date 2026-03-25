import React from 'react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from '@uiw/codemirror-themes';
import { javascript } from '@codemirror/lang-javascript';
import type { ViewUpdate } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';
import { useTheme } from '@emotion/react';
import type { ThemeFromProvider } from '../utils/theme.js';
import { defaultStyle } from './styles/index.js';

/**
 * @internal
 */
import '../../fonts/index.css';

const EditorContainer = styled.div(
  '' as unknown as TemplateStringsArray,
  defaultStyle,
);

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
          styles: [
            { tag: t.heading, color: theme.base05 },
            { tag: t.quote, color: theme.base09 },
            { tag: t.keyword, color: theme.base0F },
            { tag: t.atom, color: theme.base0F },
            { tag: t.number, color: theme.base0F },
            { tag: t.definition(t.variableName), color: theme.base0D },
            { tag: t.variableName, color: theme.base05 },
            { tag: t.propertyName, color: theme.base0C },
            { tag: t.operator, color: theme.base0E },
            { tag: t.comment, color: theme.base05, fontStyle: 'italic' },
            { tag: t.string, color: theme.base0B },
            { tag: t.meta, color: theme.base0B },
            { tag: t.tagName, color: theme.base02 },
            { tag: t.attributeName, color: theme.base0C },
            { tag: t.attributeName, color: theme.base02, cursor: 'pointer' },
            {
              tag: t.emphasis,
              color: '#999',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
            },
            { tag: t.strong, color: theme.base01 },
            {
              tag: t.invalid,
              color: theme.base05,
              borderBottom: `1px dotted ${theme.base08}`,
            },
          ],
        });

  return (
    <EditorContainer>
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
    </EditorContainer>
  );
}
