import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import { stringify } from 'javascript-stringify';
import { Delta } from 'jsondiffpatch';
import { StylingFunction } from 'react-base16-styling';
import { Base16Theme } from 'redux-devtools-themes';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';

function stringifyAndShrink(val: any, isWideLayout?: boolean) {
  if (val === null) {
    return 'null';
  }

  const str = stringify(val);
  if (typeof str === 'undefined') {
    return 'undefined';
  }

  if (isWideLayout)
    return str.length > 42 ? str.substr(0, 30) + '…' + str.substr(-10) : str;
  return str.length > 22 ? `${str.substr(0, 15)}…${str.substr(-5)}` : str;
}

const expandFirstLevel = (
  keyName: (string | number)[],
  data: any,
  level: number
) => level <= 1;

function prepareDelta(value: any) {
  if (value && value._t === 'a') {
    const res: { [key: string]: any } = {};
    for (const key in value) {
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

interface Props {
  delta: Delta | null | undefined | false;
  styling: StylingFunction;
  base16Theme: Base16Theme;
  invertTheme: boolean;
  labelRenderer: (
    keyPath: (string | number)[],
    nodeType: string,
    expanded: boolean,
    expandable: boolean
  ) => React.ReactNode;
  isWideLayout: boolean;
  dataTypeKey: string | undefined;
}

interface State {
  data: any;
}

export default class JSONDiff extends Component<Props, State> {
  state: State = { data: {} };

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps: Props) {
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
      return <div {...styling('stateDiffEmpty')}>(states are equal)</div>;
    }

    return (
      <JSONTree
        {...props}
        theme={getJsonTreeTheme(base16Theme)}
        data={this.state.data}
        getItemString={this.getItemString}
        valueRenderer={this.valueRenderer}
        postprocessValue={prepareDelta}
        isCustomNode={Array.isArray}
        shouldExpandNode={expandFirstLevel}
        hideRoot
      />
    );
  }

  getItemString = (type: string, data: any) =>
    getItemString(
      this.props.styling,
      type,
      data,
      this.props.dataTypeKey,
      this.props.isWideLayout,
      true
    );

  valueRenderer = (raw: any, value: any) => {
    const { styling, isWideLayout } = this.props;

    function renderSpan(name: string, body: string) {
      return (
        <span key={name} {...styling(['diff', name])}>
          {body}
        </span>
      );
    }

    if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          return (
            <span {...styling('diffWrap')}>
              {renderSpan(
                'diffAdd',
                stringifyAndShrink(value[0], isWideLayout)
              )}
            </span>
          );
        case 2:
          return (
            <span {...styling('diffWrap')}>
              {renderSpan(
                'diffUpdateFrom',
                stringifyAndShrink(value[0], isWideLayout)
              )}
              {renderSpan('diffUpdateArrow', ' => ')}
              {renderSpan(
                'diffUpdateTo',
                stringifyAndShrink(value[1], isWideLayout)
              )}
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
  };
}
