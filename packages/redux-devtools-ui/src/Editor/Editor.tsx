import React, { Component } from 'react';
import styled from 'styled-components';
import CodeMirror, { EditorChange } from 'codemirror';
import type { Base16Theme } from 'react-base16-styling';
import { defaultStyle, themedStyle } from './styles';
import { Theme } from '../themes/default';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';

import '../../fonts/index.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';

const EditorContainer = styled.div(
  '' as unknown as TemplateStringsArray,
  ({ theme }: { theme: Theme }) =>
    theme.scheme === 'default' && theme.light
      ? defaultStyle
      : themedStyle(theme),
);

export interface EditorProps {
  value: string;
  mode: string;
  lineNumbers: boolean;
  lineWrapping: boolean;
  readOnly: boolean;
  theme?: Base16Theme;
  foldGutter: boolean;
  autofocus: boolean;
  onChange?: (value: string, change: EditorChange) => void;
}

/**
 * Based on [CodeMirror](http://codemirror.net/).
 */
export default class Editor extends Component<EditorProps> {
  cm?: CodeMirror.Editor | null;
  node?: HTMLDivElement | null;

  componentDidMount() {
    this.cm = CodeMirror(this.node!, {
      value: this.props.value,
      mode: this.props.mode,
      lineNumbers: this.props.lineNumbers,
      lineWrapping: this.props.lineWrapping,
      readOnly: this.props.readOnly,
      autofocus: this.props.autofocus,
      foldGutter: this.props.foldGutter,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    });

    if (this.props.onChange) {
      this.cm.on('change', (doc, change) => {
        this.props.onChange!(doc.getValue(), change);
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.value !== this.cm!.getValue()) {
      this.cm!.setValue(nextProps.value);
    }
    if (nextProps.readOnly !== this.props.readOnly) {
      this.cm!.setOption('readOnly', nextProps.readOnly);
    }
    if (nextProps.lineNumbers !== this.props.lineNumbers) {
      this.cm!.setOption('lineNumbers', nextProps.lineNumbers);
    }
    if (nextProps.lineWrapping !== this.props.lineWrapping) {
      this.cm!.setOption('lineWrapping', nextProps.lineWrapping);
    }
    if (nextProps.foldGutter !== this.props.foldGutter) {
      this.cm!.setOption('foldGutter', nextProps.foldGutter);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    const node = this.node!;
    node.removeChild(node.children[0]);
    this.cm = null;
  }

  getRef: React.RefCallback<HTMLDivElement> = (node) => {
    this.node = node;
  };

  render() {
    return <EditorContainer ref={this.getRef} theme={this.props.theme} />;
  }

  static defaultProps = {
    value: '',
    mode: 'javascript',
    lineNumbers: true,
    lineWrapping: false,
    readOnly: false,
    foldGutter: true,
    autofocus: false,
  };
}
