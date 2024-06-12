// Based on https://github.com/YoruNoHikage/redux-devtools-dispatch

import React, { Component } from 'react';
import styled from 'styled-components';
import { Button, Select, Editor, Toolbar } from '@redux-devtools/ui';
import { connect, ResolveThunks } from 'react-redux';
import { dispatchRemotely } from '../../actions';
import { Options } from '../../reducers/instances';

export const DispatcherContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-top: 2px;
  background: ${(props) => props.theme.base01};
`;

export const CodeContainer = styled.div`
  height: 75px;
  padding-right: 6px;
  overflow: auto;
`;

export const ActionContainer = styled.div`
  display: table;
  width: 100%;
  color: ${(props) => props.theme.base06};

  > div {
    display: table-row;

    > div:first-child {
      width: 1px;
      padding-left: 8px;
      display: table-cell;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    > div:nth-child(2) {
      display: table-cell;
      width: 100%;
      padding: 6px;
    }
  }
`;

type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  options: Options;
}
type Props = DispatchProps & OwnProps;

interface State {
  selected: 'default' | number;
  customAction: string;
  args: string[];
  rest: string;
  changed: boolean;
}

class Dispatcher extends Component<Props, State> {
  state: State = {
    selected: 'default',
    customAction:
      this.props.options.lib === 'redux' ? "{\n  type: ''\n}" : 'this.',
    args: [],
    rest: '[]',
    changed: false,
  };

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.state.selected !== 'default' &&
      !nextProps.options.actionCreators
    ) {
      this.setState({
        selected: 'default',
        args: [],
      });
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextState !== this.state ||
      nextProps.options.actionCreators !== this.props.options.actionCreators
    );
  }

  selectActionCreator = (selected: 'default' | 'actions-help' | number) => {
    if (selected === 'actions-help') {
      window.open(
        'https://github.com/reduxjs/redux-devtools/blob/main/extension/docs/' +
          'API/Arguments.md#actioncreators',
      );
      return;
    }

    const args: string[] = [];
    if (selected !== 'default') {
      args.length = this.props.options.actionCreators![selected].args.length;
    }
    this.setState({ selected, args, rest: '[]', changed: false });
  };

  handleArg = (argIndex: number) => (value: string) => {
    const args = [
      ...this.state.args.slice(0, argIndex),
      (value || undefined)!,
      ...this.state.args.slice(argIndex + 1),
    ];
    this.setState({ args, changed: true });
  };

  handleRest = (rest: string) => {
    this.setState({ rest, changed: true });
  };

  handleCustomAction = (customAction: string) => {
    this.setState({ customAction, changed: true });
  };

  dispatchAction = () => {
    const { selected, customAction, args, rest } = this.state;

    if (selected !== 'default') {
      // remove trailing `undefined` arguments
      let i = args.length - 1;
      while (i >= 0 && typeof args[i] === 'undefined') {
        args.pop();
        i--;
      }
      this.props.dispatch({
        name: this.props.options.actionCreators![selected].name,
        selected,
        args,
        rest,
      });
    } else {
      this.props.dispatch(customAction);
    }
    this.setState({ changed: false });
  };

  render() {
    const actionCreators = this.props.options.actionCreators;
    let actionElement;

    if (this.state.selected === 'default' || !actionCreators) {
      actionElement = (
        <CodeContainer>
          <Editor
            value={this.state.customAction}
            onChange={this.handleCustomAction}
          />
        </CodeContainer>
      );
    } else {
      actionElement = (
        <ActionContainer>
          {actionCreators[this.state.selected].args.map((param, i) => (
            <div key={`${param}${i}`}>
              <div>{param}</div>
              <Editor
                lineNumbers={false}
                value={this.state.args[i]}
                onChange={this.handleArg(i)}
              />
            </div>
          ))}
          <div>
            <div>...rest</div>
            <Editor
              lineNumbers={false}
              value={this.state.rest}
              onChange={this.handleRest}
            />
          </div>
        </ActionContainer>
      );
    }

    let options: {
      value: 'default' | 'actions-help' | number;
      label: string;
    }[] = [{ value: 'default', label: 'Custom action' }];
    if (actionCreators && actionCreators.length > 0) {
      options = options.concat(
        actionCreators.map(({ name, args }, i) => ({
          value: i,
          label: `${name}(${args.join(', ')})`,
        })),
      );
    } else {
      options.push({
        value: 'actions-help',
        label: 'Add your app built-in actions…',
      });
    }

    return (
      <DispatcherContainer>
        {actionElement}
        <Toolbar>
          <Select
            menuPlacement="top"
            onChange={(option) => this.selectActionCreator(option!.value)}
            value={
              options.find((option) => option.value === this.state.selected) ||
              options.find((option) => option.value === 'default')
            }
            options={options}
          />
          <Button onClick={this.dispatchAction} primary={this.state.changed}>
            Dispatch
          </Button>
        </Toolbar>
      </DispatcherContainer>
    );
  }
}

const actionCreators = {
  dispatch: dispatchRemotely,
};

export default connect(null, actionCreators)(Dispatcher);
