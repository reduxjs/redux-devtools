import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import Dock from '../src/Dock';

describe('Dock component', function () {
  it('should have shallow rendering', function () {
    const shallowRenderer = new ShallowRenderer();
    const DockEl = <Dock />;
    shallowRenderer.render(DockEl);

    const result = shallowRenderer.getRenderOutput();

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
