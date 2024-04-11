import React from 'react';
import TestRenderer from 'react-test-renderer/shallow';
import Dock from '../src/Dock.js';

describe('Dock component', function () {
  it('should have shallow rendering', function () {
    const renderer = TestRenderer.createRenderer();
    const DockEl = <Dock />;
    renderer.render(DockEl);

    const result = renderer.getRenderOutput();

    expect(DockEl.props).toEqual({
      position: 'left',
      zIndex: 99999999,
      fluid: true,
      defaultSize: 0.3,
      dimMode: 'opaque',
      duration: 200,
    });
    expect(result.type).toBe('div');
  });
});
