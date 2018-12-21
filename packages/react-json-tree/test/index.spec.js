import React from 'react';
import expect from 'expect';
import { createRenderer } from 'react-test-renderer/shallow';

import JSONTree from '../src/index';
import JSONNode from '../src/JSONNode';

const BASIC_DATA = { a: 1, b: 'c' };

function render(component) {
  const renderer = createRenderer();
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
