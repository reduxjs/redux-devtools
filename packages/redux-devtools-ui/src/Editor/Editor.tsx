import React from 'react';
import styled from '@emotion/styled';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import type { Base16Theme } from 'react-base16-styling';
import { defaultStyle, themedStyle } from './styles';
import { Theme } from '../themes/default';
import type { ViewUpdate } from '@codemirror/view';

import '../../fonts/index.css';

const EditorContainer = styled.div(
  '' as unknown as TemplateStringsArray,
  ({ theme }: { theme?: Base16Theme }) =>
    theme!.scheme === 'default' && (theme as Theme).light
      ? defaultStyle
      : themedStyle(theme!),
);

export interface EditorProps {
  value?: string;
  lineNumbers?: boolean;
  readOnly?: boolean;
  theme?: Base16Theme;
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
  return (
    <CodeMirror
      value={value}
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
