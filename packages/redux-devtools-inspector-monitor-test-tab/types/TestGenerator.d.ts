import React, { ReactNode } from 'react';
import { TabComponentProps } from '@redux-devtools/inspector-monitor';
import { Action } from 'redux';
import { AssertionLocals, DispatcherLocals, WrapLocals } from './types.js';
export declare const fromPath: (path: (string | number)[]) => string;
export declare function compare<S>(s1: {
    state: S;
    error?: string;
} | undefined, s2: {
    state: S;
    error?: string;
}, cb: (value: {
    path: string;
    curState: number | string | undefined;
}) => void, defaultValue?: {}): void;
interface Props<S, A extends Action<string>> extends Omit<TabComponentProps<S, A>, 'monitorState' | 'updateMonitorState'> {
    name?: string;
    isVanilla?: boolean;
    wrap?: string | ((locals: WrapLocals) => string);
    dispatcher?: string | ((locals: DispatcherLocals) => string);
    assertion?: string | ((locals: AssertionLocals) => string);
    useCodemirror: boolean;
    indentation?: number;
    header?: ReactNode;
}
declare const TestGenerator_base: typeof React.PureComponent;
export default class TestGenerator<S, A extends Action<string>> extends TestGenerator_base<Props<S, A>> {
    getMethod(action: A): string;
    getAction(action: A): string | undefined;
    generateTest(): string;
    render(): React.JSX.Element;
    static defaultProps: {
        useCodemirror: boolean;
        selectedActionId: null;
        startActionId: null;
    };
}
export {};
