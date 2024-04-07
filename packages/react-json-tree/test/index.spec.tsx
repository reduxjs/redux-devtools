import React from 'react';
import TestRenderer from 'react-test-renderer/shallow';

import { JSONTree } from '../src/index.js';
import JSONNode from '../src/JSONNode.js';

const BASIC_DATA = { a: 1, b: 'c' };

function render(component: React.ReactElement) {
  const renderer = TestRenderer.createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

describe('JSONTree', () => {
  it('should render basic tree', () => {
    const result = render(<JSONTree data={BASIC_DATA} />);

    expect(result.type).toBe('ul');
    expect(result.props.children.type.name).toBe(JSONNode.name);
  });
});
