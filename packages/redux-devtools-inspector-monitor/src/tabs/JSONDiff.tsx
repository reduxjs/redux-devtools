import React, { Component } from 'react';
import { JSONTree } from 'react-json-tree';
import type { LabelRenderer, ShouldExpandNodeInitially } from 'react-json-tree';
import { stringify } from 'javascript-stringify';
import type { Delta } from 'jsondiffpatch';
import type { Base16Theme } from 'react-base16-styling';
import { css } from '@emotion/react';
import type { Interpolation, Theme } from '@emotion/react';
import type { JSX } from '@emotion/react/jsx-runtime';
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

const expandFirstLevel: ShouldExpandNodeInitially = (keyName, data, level) =>
  level <= 1;

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

const diffCss: Interpolation<Theme> = (theme) => ({
  padding: '2px 3px',
  borderRadius: '3px',
  position: 'relative',

  color: theme.TEXT_COLOR,
});

const diffWrapCss = css({ position: 'relative', zIndex: 1 });

interface Props {
  delta: Delta | null | undefined | false;
  base16Theme: Base16Theme;
  invertTheme: boolean;
  labelRenderer: LabelRenderer;
  isWideLayout: boolean;
  dataTypeKey: string | symbol | undefined;
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

  render(): JSX.Element {
    const { base16Theme, ...props } = this.props;

    if (!this.state.data) {
      return (
        <div
          css={(theme) => ({
            padding: '10px',
            color: theme.TEXT_PLACEHOLDER_COLOR,
          })}
        >
          (states are equal)
        </div>
      );
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
        shouldExpandNodeInitially={expandFirstLevel}
        hideRoot
      />
    );
  }

  getItemString = (type: string, data: any) =>
    getItemString(
      type,
      data,
      this.props.dataTypeKey,
      this.props.isWideLayout,
      true,
    );

  valueRenderer = (raw: any, value: any) => {
    const { isWideLayout } = this.props;

    if (Array.isArray(value)) {
      switch (value.length) {
        case 1:
          return (
            <span css={diffWrapCss}>
              <span
                key="diffAdd"
                css={[
                  diffCss,
                  (theme) => ({ backgroundColor: theme.DIFF_ADD_COLOR }),
                ]}
              >
                {stringifyAndShrink(value[0], isWideLayout)}
              </span>
            </span>
          );
        case 2:
          return (
            <span css={diffWrapCss}>
              <span
                key="diffUpdateFrom"
                css={[
                  diffCss,
                  (theme) => ({
                    textDecoration: 'line-through',
                    backgroundColor: theme.DIFF_REMOVE_COLOR,
                  }),
                ]}
              >
                {stringifyAndShrink(value[0], isWideLayout)}
              </span>
              <span
                key="diffUpdateArrow"
                css={[diffCss, (theme) => ({ color: theme.DIFF_ARROW_COLOR })]}
              >
                {' => '}
              </span>
              <span
                key="diffUpdateTo"
                css={[
                  diffCss,
                  (theme) => ({ backgroundColor: theme.DIFF_ADD_COLOR }),
                ]}
              >
                {stringifyAndShrink(value[1], isWideLayout)}
              </span>
            </span>
          );
        case 3:
          return (
            <span css={diffWrapCss}>
              <span
                key="diffRemove"
                css={[
                  diffCss,
                  (theme) => ({
                    textDecoration: 'line-through',
                    backgroundColor: theme.DIFF_REMOVE_COLOR,
                  }),
                ]}
              >
                {stringifyAndShrink(value[0])}
              </span>
            </span>
          );
      }
    }

    return raw;
  };
}
