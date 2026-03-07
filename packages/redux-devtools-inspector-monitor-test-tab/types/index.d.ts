import React, { Component } from 'react';
import { Action } from 'redux';
import { TabComponentProps } from '@redux-devtools/inspector-monitor';
import { Template } from './types.js';
export declare const getDefaultTemplates: () => Template[];
interface TestGeneratorMonitorState {
    hideTip?: boolean;
    selected?: number;
    templates?: Template[];
}
interface State {
    dialogStatus: 'Add' | 'Edit' | null;
}
export declare class TestTab<S, A extends Action<string>> extends Component<TabComponentProps<S, A>, State> {
    state: State;
    getPersistedState: () => TestGeneratorMonitorState;
    handleSelectTemplate: (selectedTemplate: Template | null | undefined) => void;
    handleCloseTip: () => void;
    handleCloseDialog: () => void;
    handleSubmit: ({ formData: template }: {
        formData?: Template;
    }) => void;
    handleRemove: () => void;
    addTemplate: () => void;
    editTemplate: () => void;
    updateState: (newState: TestGeneratorMonitorState) => void;
    render(): React.JSX.Element;
}
export { default as reduxAvaTemplate } from './redux/ava/index.js';
export { default as reduxJestTemplate } from './redux/jest/index.js';
export { default as reduxMochaTemplate } from './redux/mocha/index.js';
export { default as reduxTapeTemplate } from './redux/tape/index.js';
export { default as vanillaAvaTemplate } from './vanilla/ava/index.js';
export { default as vanillaJestTemplate } from './vanilla/jest/index.js';
export { default as vanillaMochaTemplate } from './vanilla/mocha/index.js';
export { default as vanillaTapeTemplate } from './vanilla/tape/index.js';
