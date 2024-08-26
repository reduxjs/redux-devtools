import React, { Component } from 'react';
import {
  Toolbar,
  Container,
  Button,
  Select,
  Notification,
  Dialog,
} from '@redux-devtools/ui';
import { MdAdd } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';
import { Action } from 'redux';
import {
  DevtoolsInspectorState,
  TabComponentProps,
} from '@redux-devtools/inspector-monitor';
import { formSchema, uiSchema, defaultFormData } from './templateForm';
import TestGenerator from './TestGenerator';
import jestTemplate from './redux/jest/template';
import mochaTemplate from './redux/mocha/template';
import tapeTemplate from './redux/tape/template';
import avaTemplate from './redux/ava/template';
import { Template } from './types';

export const getDefaultTemplates = (/* lib */): Template[] =>
  /*
   if (lib === 'redux') {
   return [mochaTemplate, tapeTemplate, avaTemplate];
   }
   return [mochaVTemplate, tapeVTemplate, avaVTemplate];
   */
  [jestTemplate, mochaTemplate, tapeTemplate, avaTemplate];

interface TestGeneratorMonitorState {
  hideTip?: boolean;
  selected?: number;
  templates?: Template[];
}

interface State {
  dialogStatus: 'Add' | 'Edit' | null;
}

export class TestTab<S, A extends Action<string>> extends Component<
  TabComponentProps<S, A>,
  State
> {
  state: State = { dialogStatus: null };

  getPersistedState = (): TestGeneratorMonitorState =>
    (this.props.monitorState as { testGenerator?: TestGeneratorMonitorState })
      .testGenerator || {};

  handleSelectTemplate = (selectedTemplate: Template | null | undefined) => {
    const { templates = getDefaultTemplates() } = this.getPersistedState();
    this.updateState({ selected: templates.indexOf(selectedTemplate!) });
  };

  handleCloseTip = () => {
    this.updateState({ hideTip: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogStatus: null });
  };

  handleSubmit = ({ formData: template }: { formData?: Template }) => {
    const { templates = getDefaultTemplates(), selected = 0 } =
      this.getPersistedState();
    if (this.state.dialogStatus === 'Add') {
      this.updateState({
        selected: templates.length,
        templates: [...templates, template!],
      });
    } else {
      const editedTemplates = [...templates];
      editedTemplates[selected] = template!;
      this.updateState({
        templates: editedTemplates,
      });
    }
    this.handleCloseDialog();
  };

  handleRemove = () => {
    const { templates = getDefaultTemplates(), selected = 0 } =
      this.getPersistedState();
    this.updateState({
      selected: 0,
      templates:
        templates.length === 1
          ? undefined
          : [...templates.slice(0, selected), ...templates.slice(selected + 1)],
    });
    this.handleCloseDialog();
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 'Add' });
  };

  editTemplate = () => {
    this.setState({ dialogStatus: 'Edit' });
  };

  updateState = (newState: TestGeneratorMonitorState) => {
    this.props.updateMonitorState({
      testGenerator: {
        ...(
          this.props.monitorState as {
            testGenerator?: TestGeneratorMonitorState;
          }
        ).testGenerator,
        ...newState,
      },
    } as Partial<DevtoolsInspectorState>);
  };

  render() {
    const { monitorState, updateMonitorState, ...rest } = this.props; // eslint-disable-line no-unused-vars, max-len
    const { dialogStatus } = this.state;
    const persistedState = this.getPersistedState();
    const { selected = 0, templates = getDefaultTemplates() } = persistedState;
    const template = templates[selected];
    const { name, assertion, dispatcher, wrap } = template;

    return (
      <Container>
        <Toolbar>
          <div style={{ flexGrow: 1 }}>
            <Select
              options={templates}
              getOptionValue={(template: Template) => template.name!}
              getOptionLabel={(template: Template) => template.name!}
              value={templates.find((template) => template.name === name)}
              onChange={this.handleSelectTemplate}
            />
          </div>
          <Button onClick={this.editTemplate}>
            <MdEdit />
          </Button>
          <Button onClick={this.addTemplate}>
            <MdAdd />
          </Button>
        </Toolbar>
        {!assertion ? (
          <Notification>No template for tests specified.</Notification>
        ) : (
          <TestGenerator<S, A>
            isVanilla={false}
            assertion={assertion}
            dispatcher={dispatcher}
            wrap={wrap}
            {...rest}
          />
        )}
        {!persistedState.hideTip &&
          assertion &&
          rest.startActionId === null && (
            <Notification onClose={this.handleCloseTip}>
              Hold <b>SHIFT</b> key to select more actions.
            </Notification>
          )}
        {dialogStatus && (
          <Dialog<Template>
            open
            title={`${dialogStatus} test template`}
            onDismiss={this.handleCloseDialog}
            onSubmit={this.handleSubmit}
            actions={[
              <Button key="cancel" onClick={this.handleCloseDialog}>
                Cancel
              </Button>,
              <Button key="remove" onClick={this.handleRemove}>
                Remove
              </Button>,
            ]}
            submitText={dialogStatus}
            schema={formSchema}
            uiSchema={uiSchema}
            formData={dialogStatus === 'Edit' ? template : defaultFormData}
          />
        )}
      </Container>
    );
  }
}

export { default as reduxAvaTemplate } from './redux/ava';
export { default as reduxJestTemplate } from './redux/jest';
export { default as reduxMochaTemplate } from './redux/mocha';
export { default as reduxTapeTemplate } from './redux/tape';
export { default as vanillaAvaTemplate } from './vanilla/ava';
export { default as vanillaJestTemplate } from './vanilla/jest';
export { default as vanillaMochaTemplate } from './vanilla/mocha';
export { default as vanillaTapeTemplate } from './vanilla/tape';
