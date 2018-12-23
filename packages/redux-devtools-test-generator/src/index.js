import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, Container, Button, Select, Notification, Dialog } from 'devui';
import { formSchema, uiSchema, defaultFormData } from './templateForm';
import AddIcon from 'react-icons/lib/md/add';
import EditIcon from 'react-icons/lib/md/edit';
import TestGenerator from './TestGenerator';
import jestTemplate from './redux/jest/template';
import mochaTemplate from './redux/mocha/template';
import tapeTemplate from './redux/tape/template';
import avaTemplate from './redux/ava/template';

export const getDefaultTemplates = (/* lib */) => (
  /*
   if (lib === 'redux') {
   return [mochaTemplate, tapeTemplate, avaTemplate];
   }
   return [mochaVTemplate, tapeVTemplate, avaVTemplate];
   */
  [jestTemplate, mochaTemplate, tapeTemplate, avaTemplate]
);

export default class TestTab extends Component {
  constructor(props) {
    super(props);
    this.state = { dialogStatus: null };
  }

  getPersistedState = () => (
    this.props.monitorState.testGenerator || {}
  );

  handleSelectTemplate = selectedTemplate => {
    const { templates = getDefaultTemplates() } = this.getPersistedState();
    this.updateState({ selected: templates.indexOf(selectedTemplate) });
  };

  handleCloseTip = () => {
    this.updateState({ hideTip: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogStatus: null });
  };

  handleSubmit = ({ formData: template }) => {
    const { templates = getDefaultTemplates(), selected = 0 } = this.getPersistedState();
    if (this.state.dialogStatus === 'Add') {
      this.updateState({
        selected: templates.length,
        templates: [...templates, template]
      });
    } else {
      const editedTemplates = [...templates];
      editedTemplates[selected] = template;
      this.updateState({
        templates: editedTemplates
      });
    }
    this.handleCloseDialog();
  };

  handleRemove = () => {
    const { templates = getDefaultTemplates(), selected = 0 } = this.getPersistedState();
    this.updateState({
      selected: 0,
      templates: templates.length === 1 ? undefined : [
        ...templates.slice(0, selected),
        ...templates.slice(selected + 1)
      ]
    });
    this.handleCloseDialog();
  };

  addTemplate = () => {
    this.setState({ dialogStatus: 'Add' });
  };

  editTemplate = () => {
    this.setState({ dialogStatus: 'Edit' });
  };

  updateState = newState => {
    this.props.updateMonitorState({
      testGenerator: {
        ...this.props.monitorState.testGenerator,
        ...newState
      }
    });
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
          <Select
            options={templates}
            valueKey="name"
            labelKey="name"
            value={name}
            simpleValue={false}
            onChange={this.handleSelectTemplate}
          />
          <Button onClick={this.editTemplate}><EditIcon /></Button>
          <Button onClick={this.addTemplate}><AddIcon /></Button>
        </Toolbar>
        {!assertion ?
          <Notification>
            No template for tests specified.
          </Notification>
        :
          <TestGenerator
            isVanilla={false}
            assertion={assertion}
            dispatcher={dispatcher}
            wrap={wrap}
            {...rest}
          />
        }
        {!persistedState.hideTip && assertion && rest.startActionId === null &&
          <Notification onClose={this.handleCloseTip}>
            Hold <b>SHIFT</b> key to select more actions.
          </Notification>
        }
        {dialogStatus &&
          <Dialog
            open
            title={`${dialogStatus} test template`}
            onDismiss={this.handleCloseDialog}
            onSubmit={this.handleSubmit}
            actions={[
              <Button key="cancel" onClick={this.handleCloseDialog}>Cancel</Button>,
              <Button key="remove" onClick={this.handleRemove}>Remove</Button>
            ]}
            submitText={dialogStatus}
            schema={formSchema}
            uiSchema={uiSchema}
            formData={dialogStatus === 'Edit' ? template : defaultFormData}
          />
        }
      </Container>
    );
  }
}

TestTab.propTypes = {
  monitorState: PropTypes.shape({
    testGenerator: PropTypes.shape({
      templates: PropTypes.array,
      selected: PropTypes.number,
      hideTip: PropTypes.bool
    })
  }).isRequired,
  /*
  options: PropTypes.shape({
    lib: PropTypes.string
  }).isRequired,
  */
  updateMonitorState: PropTypes.func.isRequired
};
