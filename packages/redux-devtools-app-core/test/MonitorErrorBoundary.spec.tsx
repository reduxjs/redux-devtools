import { vi } from 'vitest';
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MonitorErrorBoundary } from '../src/components/MonitorErrorBoundary.js';

function Crash({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new TypeError(
      "Cannot read properties of undefined (reading 'action')",
    );
  }
  return <div data-testid="monitor-ok">ok</div>;
}

describe('MonitorErrorBoundary', () => {
  it('shows the error and recovers after reset', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const selectMonitorWithState = vi.fn();
    const monitorState = {
      tabName: 'Trace',
      inspectedActionPath: ['payload'],
      selectedActionId: 4,
    };
    const tree = (shouldThrow: boolean) => (
      <MonitorErrorBoundary
        monitor="InspectorMonitor"
        monitorState={monitorState}
        selectMonitorWithState={selectMonitorWithState}
      >
        <Crash shouldThrow={shouldThrow} />
      </MonitorErrorBoundary>
    );

    const { rerender } = render(tree(true));

    const errorBox = screen.getByTestId('monitor-error');
    expect(errorBox.textContent).toContain('InspectorMonitor');
    expect(errorBox.textContent).toContain("reading 'action'");

    rerender(tree(false));
    fireEvent.click(screen.getByText('Reset monitor state'));

    expect(selectMonitorWithState).toHaveBeenCalledWith('InspectorMonitor', {
      tabName: 'Trace',
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: [],
      inspectedStatePath: [],
    });
    expect(screen.getByTestId('monitor-ok')).toBeTruthy();
    consoleError.mockRestore();
  });
});
