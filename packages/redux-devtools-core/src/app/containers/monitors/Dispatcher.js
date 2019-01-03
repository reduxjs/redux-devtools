// Based on https://github.com/YoruNoHikage/redux-devtools-dispatch

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Select, Editor, Toolbar } from 'devui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dispatchRemotely } from '../../actions';

export const DispatcherContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding-top: 2px;
  background: ${props => props.theme.base01};
`;

export const CodeContainer = styled.div`
  height: 75px;
  padding-right: 6px;
  overflow: auto;
`;

export const ActionContainer = styled.div`
  display: table;
  width: 100%;
  color: ${props => props.theme.base06};

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

class Dispatcher extends Component {
  static propTypes = {
    options: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  state = {
    selected: 'default',
    customAction: this.props.options.lib === 'redux' ? '{\n  type: \'\'\n}' : 'this.',
    args: [],
    rest: '[]',
    changed: false
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.selected !== 'default' && !nextProps.options.actionCreators) {
      this.setState({
        selected: 'default',
        args: []
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state ||
      nextProps.options.actionCreators !== this.props.options.actionCreators;
  }

  selectActionCreator = selected => {
    if (selected === 'actions-help') {
      window.open('https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/' +
        'basics/Dispatcher.md');
      return;
    }

    const args = [];
    if (selected !== 'default') {
      args.length = this.props.options.actionCreators[selected].args.length;
    }
    this.setState({ selected, args, rest: '[]', changed: false });
  };

  handleArg = argIndex => value => {
    const args = [
      ...this.state.args.slice(0, argIndex),
      value || undefined,
      ...this.state.args.slice(argIndex + 1),
    ];
    this.setState({ args, changed: true });
  };

  handleRest = rest => {
    this.setState({ rest, changed: true });
  };

  handleCustomAction = customAction => {
    this.setState({ customAction, changed: true });
  };

  dispatchAction = () => {
    const { selected, customAction, args, rest } = this.state;

    if (this.state.selected !== 'default') {
      // remove trailing `undefined` arguments
      let i = args.length - 1;
      while (i >= 0 && typeof args[i] === 'undefined') {
        args.pop(i); i--;
      }
      this.props.dispatch({
        name: this.props.options.actionCreators[selected].name,
        selected,
        args,
        rest
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

    let options = [{ value: 'default', label: 'Custom action' }];
    if (actionCreators && actionCreators.length > 0) {
      options = options.concat(actionCreators.map(({ name, func, args }, i) => ({
        value: i,
        label: `${name}(${args.join(', ')})`
      })));
    } else {
      options.push({ value: 'actions-help', label: 'Add your app built-in actions…' });
    }

    return (
      <DispatcherContainer>
        {actionElement}
        <Toolbar>
          <Select
            openOuterUp
            onChange={this.selectActionCreator}
            value={this.state.selected || 'default'}
            options={options}
          />
          <Button onClick={this.dispatchAction} primary={this.state.changed}>Dispatch</Button>
        </Toolbar>
      </DispatcherContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch: bindActionCreators(dispatchRemotely, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(Dispatcher);
