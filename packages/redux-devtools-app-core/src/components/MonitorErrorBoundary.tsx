import React, { Component, ReactNode } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { selectMonitorWithState } from '../actions/index.js';
import { MonitorStateMonitorState } from '../reducers/monitor.js';

interface OwnProps {
  monitor: string;
  monitorState: MonitorStateMonitorState | undefined;
  children: ReactNode;
}
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = OwnProps & DispatchProps;

interface State {
  error: Error | null;
}

export class MonitorErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(`Monitor "${this.props.monitor}" crashed`, error);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.monitor !== this.props.monitor && this.state.error) {
      this.setState({ error: null });
    }
  }

  handleReset = () => {
    const { monitor, monitorState } = this.props;
    this.props.selectMonitorWithState(monitor, {
      ...monitorState,
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: [],
      inspectedStatePath: [],
    });
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div
        data-testid="monitor-error"
        style={{ padding: '10px 15px', overflow: 'auto' }}
      >
        <p>
          The <b>{this.props.monitor}</b> monitor failed to render.
        </p>
        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {error.stack || error.message}
        </pre>
        <Button onClick={this.handleReset}>Reset monitor state</Button>
      </div>
    );
  }
}

const actionCreators = {
  selectMonitorWithState,
};

export default connect(null, actionCreators)(MonitorErrorBoundary);
