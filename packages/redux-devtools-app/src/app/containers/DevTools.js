import React, { Component, PropTypes, createElement } from 'react';
import { withTheme } from 'styled-components';
import getMonitor from '../utils/getMonitor';

class DevTools extends Component {
  constructor(props) {
    super(props);
    this.getMonitor(props, props.monitorState);
  }

  getMonitor(props, skipUpdate) {
    const monitorElement = getMonitor(props);
    this.monitorProps = monitorElement.props;
    this.Monitor = monitorElement.type;

    const update = this.Monitor.update;
    if (update) {
      let newMonitorState;
      const monitorState = props.monitorState;
      if (skipUpdate || monitorState && monitorState.__overwritten__ === props.monitor) {
        newMonitorState = monitorState;
      } else {
        newMonitorState = update(this.monitorProps, undefined, {});
        if (newMonitorState !== monitorState) {
          this.preventRender = true;
        }
      }
      this.dispatch({
        type: '@@INIT_MONITOR',
        newMonitorState,
        update,
        monitorProps: this.monitorProps
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.monitor !== this.props.monitor) this.getMonitor(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.monitorState !== this.props.liftedState ||
      nextProps.features !== this.props.features ||
      nextProps.theme.scheme !== this.props.theme.scheme
    );
  }

  dispatch = action => {
    this.props.dispatch(action);
  };

  render() {
    if (this.preventRender) {
      this.preventRender = false;
      return null;
    }

    const liftedState = {
      ...this.props.liftedState,
      monitorState: this.props.monitorState
    };
    return (
      <div className={`monitor monitor-${this.props.monitor}`}>
        <this.Monitor
          {...liftedState}
          {...this.monitorProps}
          features={this.props.features}
          dispatch={this.dispatch}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

DevTools.propTypes = {
  liftedState: PropTypes.object,
  monitorState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  monitor: PropTypes.string,
  features: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withTheme(DevTools);
