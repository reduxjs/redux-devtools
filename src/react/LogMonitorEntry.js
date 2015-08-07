import React, { PropTypes } from 'react';
import JSONTree from './JSONTree';
import LogMonitorEntryAction from "./LogMonitorEntryAction";

function hsvToRgb(h, s, v) {
  const i = Math.floor(h);
  const f = h - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  const mod = i % 6;
  const r = [v, q, p, p, t, v][mod];
  const g = [t, v, v, q, p, p][mod];
  const b = [p, p, t, v, v, q][mod];

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function colorFromString(token) {
  const splitToken = token.split('');
  const finalToken = splitToken.concat(splitToken.reverse());

  const number = finalToken.reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  ) * Math.abs(Math.sin(token.length));

  const h = Math.round((number * (180 / Math.PI) * token.length) % 360);
  const s = number % 100 / 100;
  const v = 1;

  return hsvToRgb(h, s, v);
}

const styles = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none'
  }
};

export default class LogMonitorEntry {
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
        return <JSONTree keyName={'state'} data={this.props.select(state)} />
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }
    return (
      <span style={{
        paddingLeft: 15,
        fontStyle: 'italic'
      }}>
        ({errorText})
      </span>
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
   const { r, g, b } = colorFromString(action.type);
   const styleEntry = {
     opacity: collapsed ? 0.5 : 1,
     color: `rgb(${r}, ${g}, ${b})`,
     cursor: (index > 0) ? 'pointer' : 'default'
   };
   return (
    <div style={{textDecoration: collapsed ? 'line-through' : 'none'}}>
      <LogMonitorEntryAction collapsed={collapsed} action={action} onClick={::this.handleActionClick} style={{...styles.entry, ...styleEntry}}/>
      {!collapsed &&
        <div style={{
          borderBottom: '1px solid #20262c',
          paddingLeft: 15
        }}>
          {this.printState(state, error)}
        </div>
      }
      </div>
    );
  }
}
