import React, { Component } from 'react';
import { Toolbar, Container, Button, Select, Notification, Dialog, } from '@redux-devtools/ui';
import { MdAdd } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { formSchema, uiSchema, defaultFormData } from './templateForm.js';
import TestGenerator from './TestGenerator.js';
import jestTemplate from './redux/jest/template.js';
import mochaTemplate from './redux/mocha/template.js';
import tapeTemplate from './redux/tape/template.js';
import avaTemplate from './redux/ava/template.js';
export const getDefaultTemplates = ( /* lib */) => 
/*
 if (lib === 'redux') {
 return [mochaTemplate, tapeTemplate, avaTemplate];
 }
 return [mochaVTemplate, tapeVTemplate, avaVTemplate];
 */
[jestTemplate, mochaTemplate, tapeTemplate, avaTemplate];
export class TestTab extends Component {
    constructor() {
        super(...arguments);
        this.state = { dialogStatus: null };
        this.getPersistedState = () => this.props.monitorState
            .testGenerator || {};
        this.handleSelectTemplate = (selectedTemplate) => {
            const { templates = getDefaultTemplates() } = this.getPersistedState();
            this.updateState({ selected: templates.indexOf(selectedTemplate) });
        };
        this.handleCloseTip = () => {
            this.updateState({ hideTip: true });
        };
        this.handleCloseDialog = () => {
            this.setState({ dialogStatus: null });
        };
        this.handleSubmit = ({ formData: template }) => {
            const { templates = getDefaultTemplates(), selected = 0 } = this.getPersistedState();
            if (this.state.dialogStatus === 'Add') {
                this.updateState({
                    selected: templates.length,
                    templates: [...templates, template],
                });
            }
            else {
                const editedTemplates = [...templates];
                editedTemplates[selected] = template;
                this.updateState({
                    templates: editedTemplates,
                });
            }
            this.handleCloseDialog();
        };
        this.handleRemove = () => {
            const { templates = getDefaultTemplates(), selected = 0 } = this.getPersistedState();
            this.updateState({
                selected: 0,
                templates: templates.length === 1
                    ? undefined
                    : [...templates.slice(0, selected), ...templates.slice(selected + 1)],
            });
            this.handleCloseDialog();
        };
        this.addTemplate = () => {
            this.setState({ dialogStatus: 'Add' });
        };
        this.editTemplate = () => {
            this.setState({ dialogStatus: 'Edit' });
        };
        this.updateState = (newState) => {
            this.props.updateMonitorState({
                testGenerator: {
                    ...this.props.monitorState.testGenerator,
                    ...newState,
                },
            });
        };
    }
    render() {
        const { monitorState, updateMonitorState, ...rest } = this.props; // eslint-disable-line no-unused-vars, max-len
        const { dialogStatus } = this.state;
        const persistedState = this.getPersistedState();
        const { selected = 0, templates = getDefaultTemplates() } = persistedState;
        const template = templates[selected];
        const { name, assertion, dispatcher, wrap } = template;
        return (React.createElement(Container, null,
            React.createElement(Toolbar, null,
                React.createElement("div", { style: { flexGrow: 1 } },
                    React.createElement(Select, { options: templates, getOptionValue: (template) => template.name, getOptionLabel: (template) => template.name, value: templates.find((template) => template.name === name), onChange: this.handleSelectTemplate })),
                React.createElement(Button, { onClick: this.editTemplate },
                    React.createElement(MdEdit, null)),
                React.createElement(Button, { onClick: this.addTemplate },
                    React.createElement(MdAdd, null))),
            !assertion ? (React.createElement(Notification, null, "No template for tests specified.")) : (React.createElement(TestGenerator, { isVanilla: false, assertion: assertion, dispatcher: dispatcher, wrap: wrap, ...rest })),
            !persistedState.hideTip &&
                assertion &&
                rest.startActionId === null && (React.createElement(Notification, { onClose: this.handleCloseTip },
                "Hold ",
                React.createElement("b", null, "SHIFT"),
                " key to select more actions.")),
            dialogStatus && (React.createElement(Dialog, { open: true, title: `${dialogStatus} test template`, onDismiss: this.handleCloseDialog, onSubmit: this.handleSubmit, actions: [
                    React.createElement(Button, { key: "cancel", onClick: this.handleCloseDialog }, "Cancel"),
                    React.createElement(Button, { key: "remove", onClick: this.handleRemove }, "Remove"),
                ], submitText: dialogStatus, schema: formSchema, uiSchema: uiSchema, formData: dialogStatus === 'Edit' ? template : defaultFormData }))));
    }
}
export { default as reduxAvaTemplate } from './redux/ava/index.js';
export { default as reduxJestTemplate } from './redux/jest/index.js';
export { default as reduxMochaTemplate } from './redux/mocha/index.js';
export { default as reduxTapeTemplate } from './redux/tape/index.js';
export { default as vanillaAvaTemplate } from './vanilla/ava/index.js';
export { default as vanillaJestTemplate } from './vanilla/jest/index.js';
export { default as vanillaMochaTemplate } from './vanilla/mocha/index.js';
export { default as vanillaTapeTemplate } from './vanilla/tape/index.js';
