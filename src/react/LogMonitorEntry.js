import React, { PropTypes, Component } from 'react';
import JSONTree from 'react-json-tree';
import LogMonitorEntryAction from './LogMonitorEntryAction';

const styles = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none'
  },
  tree: {
    paddingLeft: 0
  }
};

export default class LogMonitorEntry extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    state: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
    select: PropTypes.func.isRequired,
    error: PropTypes.string,
    onActionClick: PropTypes.func.isRequired,
    collapsed: PropTypes.bool
  };

  printState(state, error) {
    let errorText = error;
    if (!errorText) {
      try {
        return <JSONTree
          theme={this.props.theme}
          keyName={'state'}
          data={this.props.select(state)}
          previousData={this.props.select(this.props.previousState)}
          style={styles.tree}/>;
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }
    return (
      <div style={{
        color: this.props.theme.base08,
        paddingTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 35
      }}>
        {errorText}
      </div>
    );
  }

  handleActionClick() {
    const { index, onActionClick } = this.props;
    if (index > 0) {
      onActionClick(index);
    }
  }

  render() {
    const { index, error, action, state, collapsed } = this.props;
    const styleEntry = {
      opacity: collapsed ? 0.5 : 1,
      cursor: (index > 0) ? 'pointer' : 'default'
    };
    return (
      <div style={{textDecoration: collapsed ? 'line-through' : 'none'}}>
        <LogMonitorEntryAction
          theme={this.props.theme}
          collapsed={collapsed}
          action={action}
          onClick={::this.handleActionClick}
          style={{...styles.entry, ...styleEntry}}/>
        {!collapsed &&
          <div>
            {this.printState(state, error)}
          </div>
        }
      </div>
    );
  }
}
