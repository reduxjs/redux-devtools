import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import stringify from 'javascript-stringify';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';

function stringifyAndShrink(val, isWideLayout) {
  if (val === null) { return 'null'; }

  const str = stringify(val);
  if (typeof str === 'undefined') { return 'undefined'; }

  if (isWideLayout) return str.length > 42 ? str.substr(0, 30) + '…' + str.substr(-10) : str;
  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

const expandFirstLevel = (keyName, data, level) => level <= 1;

function prepareDelta(value) {
  if (value && value._t === 'a') {
    const res = {};
    for (let key in value) {
      if (key !== '_t') {
        if (key[0] === '_' && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key];
        } else if (value['_' + key]) {
          res[key] = [value['_' + key][0], value[key][0]];
        } else if (!value['_' + key] && key[0] !== '_') {
          res[key] = value[key];
        }
      }
    }
    return res;
  }

  return value;
}

export default class JSONDiff extends Component {
  state = { data: {} }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.delta !== this.props.delta) {
      this.updateData();
    }
  }

  updateData() {
    // this magically fixes weird React error, where it can't find a node in tree
    // if we set `delta` as JSONTree data right away
    // https://github.com/alexkuz/redux-devtools-inspector/issues/17

    this.setState({ data: this.props.delta });
  }

  render() {
    const { styling, base16Theme, ...props } = this.props;

    if (!this.state.data) {
      return (
        <div {...styling('stateDiffEmpty')}>
          (states are equal)
        </div>
      );
    }

    return (
      <JSONTree {...props}
        theme={getJsonTreeTheme(base16Theme)}
        data={this.state.data}
        getItemString={this.getItemString}
        valueRenderer={this.valueRenderer}
        postprocessValue={prepareDelta}
        isCustomNode={Array.isArray}
        shouldExpandNode={expandFirstLevel}
        hideRoot />
    );
  }

  getItemString = (type, data) => (
    getItemString(
      this.props.styling, type, data, this.props.dataTypeKey, this.props.isWideLayout, true
    )
  )

  valueRenderer = (raw, value) => {
    const { styling, isWideLayout } = this.props;

    function renderSpan(name, body) {
      return (
        <span key={name} {...styling(['diff', name])}>{body}</span>
      );
    }

    if (Array.isArray(value)) {
      switch(value.length) {
      case 1:
        return (
          <span {...styling('diffWrap')}>
            {renderSpan('diffAdd', stringifyAndShrink(value[0], isWideLayout))}
          </span>
        );
      case 2:
        return (
          <span {...styling('diffWrap')}>
            {renderSpan('diffUpdateFrom', stringifyAndShrink(value[0], isWideLayout))}
            {renderSpan('diffUpdateArrow', ' => ')}
            {renderSpan('diffUpdateTo', stringifyAndShrink(value[1], isWideLayout))}
          </span>
        );
      case 3:
        return (
          <span {...styling('diffWrap')}>
            {renderSpan('diffRemove', stringifyAndShrink(value[0]))}
          </span>
        );
      }
    }

    return raw;
  }
}
