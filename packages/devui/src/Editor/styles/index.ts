import { css } from 'styled-components';
import { Theme } from '../../themes/default';

export const defaultStyle = `
  height: 100%;
  overflow: auto;

  > div {
    height: 100%;
    line-height: 1.45em;
  }
`;

export const themedStyle = (theme: Theme) => css`
  height: 100%;

  > div {
    height: 100%;
    line-height: 1.45em;
    background-color: ${theme.base00};
    color: ${theme.base04};

    .cm-header {
      color: ${theme.base05};
    }
    .cm-quote {
      color: ${theme.base09};
    }

    .cm-keyword {
      color: ${theme.base0F};
    }
    .cm-atom {
      color: ${theme.base0F};
    }
    .cm-number {
      color: ${theme.base0F};
    }
    .cm-def {
      color: ${theme.base0D};
    }

    .cm-variable {
      color: ${theme.base05};
    }
    .cm-variable-2 {
      color: ${theme.base0A};
    }
    .cm-variable-3 {
      color: ${theme.base0E};
    }

    .cm-property {
      color: ${theme.base0C};
    }
    .cm-operator {
      color: ${theme.base0E};
    }

    .cm-comment {
      color: ${theme.base05};
      font-style: italic;
    }

    .cm-string {
      color: ${theme.base0B};
    }
    .cm-string-2 {
      color: ${theme.base0A};
    }

    .cm-meta {
      color: ${theme.base0B};
    }
    .cm-qualifier {
      color: ${theme.base0A};
    }
    .cm-builtin {
      color: ${theme.base0F};
    }
    .cm-bracket {
      color: ${theme.base09};
    }
    .CodeMirror-matchingbracket {
      color: ${theme.base0B};
    }
    .CodeMirror-nonmatchingbracket {
      color: ${theme.base08};
    }
    .cm-tag {
      color: ${theme.base02};
    }
    .cm-attribute {
      color: ${theme.base0C};
    }

    .cm-hr {
      color: transparent;
      border-top: 1px solid ${theme.base05};
      display: block;
    }

    .cm-link {
      color: ${theme.base02};
      cursor: pointer;
    }

    .cm-special {
      color: ${theme.base0E};
    }

    .cm-em {
      color: #999;
      text-decoration: underline;
      text-decoration-style: dotted;
    }

    .cm-strong {
      color: ${theme.base01};
    }

    .cm-error,
    .cm-invalidchar {
      color: ${theme.base05};
      border-bottom: 1px dotted ${theme.base08};
    }

    div.CodeMirror-selected {
      background: ${theme.base01};
    }

    .CodeMirror-line::selection,
    .CodeMirror-line > span::selection,
    .CodeMirror-line > span > span::selection {
      background: ${theme.base01};
    }

    .CodeMirror {
      box-shadow: inset 7px 0 12px -6px #000;
    }

    .CodeMirror-gutters {
      border-right: 0;
    }

    .CodeMirror-gutters {
      background-color: ${theme.base01};
    }

    .CodeMirror-linenumber {
      color: ${theme.base03};
    }

    .CodeMirror-linenumber {
      padding: 0 5px;
    }

    .CodeMirror-guttermarker-subtle {
      color: ${theme.base05};
    }
    .CodeMirror-guttermarker {
      color: ${theme.base09};
    }

    .CodeMirror-gutter .CodeMirror-gutter-text {
      color: ${theme.base05};
    }

    .CodeMirror-cursor {
      border-left: 1px solid #819090;
    }

    .cm-fat-cursor .CodeMirror-cursor {
      background: ${theme.base02};
    }
    .cm-animate-fat-cursor {
      background-color: ${theme.base02};
    }

    .CodeMirror-activeline-background {
      background: ${theme.base07};
    }
  }
`;
