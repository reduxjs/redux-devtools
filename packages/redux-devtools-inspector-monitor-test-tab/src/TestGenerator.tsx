import React, { PureComponent, Component, ReactNode } from 'react';
import { stringify } from 'javascript-stringify';
import objectPath from 'object-path';
import jsan from 'jsan';
import diff, { DiffEvent } from 'simple-diff';
import es6template from 'es6template';
import { Editor } from '@redux-devtools/ui';
import { TabComponentProps } from '@redux-devtools/inspector-monitor';
import { Action } from 'redux';
import { AssertionLocals, DispatcherLocals, WrapLocals } from './types';

export const fromPath = (path: (string | number)[]) =>
  path.map((a) => (typeof a === 'string' ? `.${a}` : `[${a}]`)).join('');

function getState<S>(
  s: { state: S; error?: string } | undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  defaultValue?: {},
) {
  if (!s) return defaultValue;
  return JSON.parse(jsan.stringify(s.state));
}

export function compare<S>(
  s1: { state: S; error?: string } | undefined,
  s2: { state: S; error?: string },
  cb: (value: { path: string; curState: number | string | undefined }) => void,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  defaultValue?: {},
) {
  const paths: string[] = []; // Already processed
  function generate(
    event: DiffEvent | { type: 'move-item'; newPath: (string | number)[] },
  ) {
    let curState: number | string | undefined;
    let path = fromPath(event.newPath);

    if (event.type === 'remove-item' || event.type === 'move-item') {
      if (paths.length && paths.includes(path)) return;
      paths.push(path);
      const v = objectPath.get(s2.state as unknown as object, event.newPath);
      curState = v.length;
      path += '.length';
    } else if (event.type === 'add-item') {
      generate({ type: 'move-item', newPath: event.newPath });
      path += `[${event.newIndex!}]`;
      curState = stringify(event.newValue);
    } else {
      curState = stringify(event.newValue);
    }

    // console.log(`expect(store${path}).toEqual(${curState});`);
    cb({ path, curState });
  }

  diff(
    getState(s1, defaultValue),
    getState(s2, defaultValue) /* , { idProp: '*' } */,
  ).forEach(generate);
}

interface Props<S, A extends Action<string>>
  extends Omit<TabComponentProps<S, A>, 'monitorState' | 'updateMonitorState'> {
  name?: string;
  isVanilla?: boolean;
  wrap?: string | ((locals: WrapLocals) => string);
  dispatcher?: string | ((locals: DispatcherLocals) => string);
  assertion?: string | ((locals: AssertionLocals) => string);
  useCodemirror: boolean;
  indentation?: number;
  header?: ReactNode;
}

export default class TestGenerator<
  S,
  A extends Action<string>,
> extends (PureComponent || Component)<Props<S, A>> {
  getMethod(action: A) {
    let type = action.type;
    if (type[0] === '┗') type = type.substr(1).trim();
    const args = (action as unknown as { arguments: unknown[] }).arguments
      ? (action as unknown as { arguments: unknown[] }).arguments
          .map((arg) => stringify(arg))
          .join(',')
      : '';
    return `${type}(${args})`;
  }

  getAction(action: A) {
    if (action.type === '@@INIT') return '{}';
    return stringify(action);
  }

  generateTest() {
    const {
      computedStates,
      actions,
      selectedActionId,
      startActionId,
      isVanilla,
      name,
    } = this.props;

    if (!actions || !computedStates || computedStates.length < 1) return '';

    let { wrap, assertion, dispatcher, indentation } = this.props;
    if (typeof assertion === 'string')
      assertion = es6template.compile(assertion);
    if (typeof wrap === 'string') {
      const ident = /\n.+\$\{assertions}/.exec(wrap);
      if (ident) indentation = ident[0].length - 13;
      wrap = es6template.compile(wrap);
    }
    if (typeof dispatcher === 'string')
      dispatcher = es6template.compile(dispatcher);

    let space = '';
    if (indentation) space = Array(indentation).join(' ');

    let r = '';
    let isFirst = true;
    let i;
    if (startActionId !== null) i = startActionId;
    else if (selectedActionId !== null) i = selectedActionId;
    else i = computedStates.length - 1;
    const startIdx = i > 0 ? i : 1;

    const addAssertions = ({
      path,
      curState,
    }: {
      path: string;
      curState: number | string | undefined;
    }) => {
      r += `${space}${(assertion as (locals: AssertionLocals) => string)({
        path,
        curState,
      })}\n`;
    };

    while (actions[i]) {
      if (
        !isVanilla ||
        /* eslint-disable-next-line no-useless-escape */
        /^┗?\s?[a-zA-Z0-9_@.\[\]-]+?$/.test(actions[i].action.type)
      ) {
        if (isFirst) isFirst = false;
        else r += space;
        if (!isVanilla || actions[i].action.type[0] !== '@') {
          r +=
            (dispatcher as (locals: DispatcherLocals) => string)({
              action: !isVanilla
                ? this.getAction(actions[i].action)
                : this.getMethod(actions[i].action),
              prevState:
                i > 0 ? stringify(computedStates[i - 1].state) : undefined,
            }) + '\n';
        }
        if (!isVanilla) {
          addAssertions({
            path: '',
            curState: stringify(computedStates[i].state),
          });
        } else {
          compare(
            computedStates[i - 1],
            computedStates[i],
            addAssertions,
            isVanilla && {},
          );
        }
      }
      i++;
      if (i > selectedActionId!) break;
    }

    r = r.trim();
    if (wrap) {
      if (!isVanilla) r = wrap({ name, assertions: r });
      else {
        r = wrap({
          name: /^[a-zA-Z0-9_-]+?$/.test(name as string) ? name : 'Store',
          actionName:
            (selectedActionId === null || selectedActionId > 0) &&
            actions[startIdx]
              ? actions[startIdx].action.type.replace(/[^a-zA-Z0-9_-]+/, '')
              : 'should return the initial state',
          initialState: stringify(computedStates[startIdx - 1].state),
          assertions: r,
        });
      }
    }
    return r;
  }

  render() {
    const code = this.generateTest();

    if (!this.props.useCodemirror) {
      return (
        <textarea
          style={{ padding: '10px', width: '100%', height: '100%' }}
          defaultValue={code}
        />
      );
    }

    return <Editor value={code} />;
  }

  static defaultProps = {
    useCodemirror: true,
    selectedActionId: null,
    startActionId: null,
  };
}
