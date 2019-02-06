import React from 'react';
import { configure, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import StackTraceTab from '../src/StackTraceTab';

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

function genAsyncSnapshot(component, done) {
  setTimeout(() => {
    component.update();
    expect(toJson(component)).toMatchSnapshot();
    done();
  });
}

const actions = {
  0: { type: 'PERFORM_ACTION', action: { type: '@@INIT' } },
  1: { type: 'PERFORM_ACTION', action: { type: 'INCREMENT_COUNTER' } },
  2: {
    type: 'PERFORM_ACTION',
    action: { type: 'INCREMENT_COUNTER' },
    stack:
      'Error\n    at fn1 (app.js:72:24)\n    at fn2 (app.js:84:31)\n     ' +
      'at fn3 (chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/page.bundle.js:1269:80)'
  }
};

describe('StackTraceTab component', () => {
  it('should render with no props', done => {
    const component = mount(<StackTraceTab />);
    genAsyncSnapshot(component, done);
  });

  it('should render with props, but without stack', done => {
    const component = mount(
      <StackTraceTab actions={actions} action={actions[0].action} />
    );
    genAsyncSnapshot(component, done);
  });

  it('should render the link to docs', done => {
    const component = mount(
      <StackTraceTab actions={actions} action={actions[1].action} />
    );
    genAsyncSnapshot(component, done);
  });

  it('should render with trace stack', done => {
    const component = mount(
      <StackTraceTab actions={actions} action={actions[2].action} />
    );
    genAsyncSnapshot(component, done);
  });
});
