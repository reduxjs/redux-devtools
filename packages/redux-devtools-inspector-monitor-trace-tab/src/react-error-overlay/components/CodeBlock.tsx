/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { CSSProperties } from 'react';

const preStyle: CSSProperties = {
  position: 'relative',
  display: 'block',
  backgroundColor: '#000',
  padding: '0.5em',
  marginTop: '0.5em',
  marginBottom: '0.5em',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
  borderRadius: '0.25rem',
};

const codeStyle = {
  fontFamily: 'Consolas, Menlo, monospace',
};

interface CodeBlockPropsType {
  main: boolean;
  codeHTML: string;
}

function CodeBlock(props: CodeBlockPropsType) {
  const codeBlock = { __html: props.codeHTML };

  return (
    <pre style={preStyle}>
      <code style={codeStyle} dangerouslySetInnerHTML={codeBlock} />
    </pre>
  );
}

export default CodeBlock;
