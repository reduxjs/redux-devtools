import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TraceTab } from '../src/StackTraceTab';

const actions = {
  0: { type: 'PERFORM_ACTION', action: { type: '@@INIT' } },
  1: { type: 'PERFORM_ACTION', action: { type: 'INCREMENT_COUNTER' } },
  2: {
    type: 'PERFORM_ACTION',
    action: { type: 'INCREMENT_COUNTER' },
    stack:
      'Error\n    at fn1 (app.js:72:24)\n    at fn2 (app.js:84:31)\n     ' +
      'at fn3 (chrome-extension://lmhkpmbekcpmknklioeibfkpmmfibljd/js/page.bundle.js:1269:80)',
  },
};

const TraceTabAsAny = TraceTab as any;

describe('StackTraceTab component', () => {
  it('should render with no props', async () => {
    const { container } = render(<TraceTabAsAny />);
    await screen.findByTestId('stack-trace');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with props, but without stack', async () => {
    const { container } = render(
      <TraceTabAsAny actions={actions} action={actions[0].action} />,
    );
    await screen.findByTestId('stack-trace');
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render the link to docs', () => {
    const { container } = render(
      <TraceTabAsAny actions={actions} action={actions[1].action} />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render with trace stack', async () => {
    const { container } = render(
      <TraceTabAsAny actions={actions} action={actions[2].action} />,
    );
    const stackTraceDiv = await screen.findByTestId('stack-trace');
    await waitFor(() =>
      expect(stackTraceDiv.querySelector('div')).toBeTruthy(),
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
