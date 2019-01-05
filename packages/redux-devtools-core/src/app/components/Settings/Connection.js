import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'devui';
import { saveSocketSettings } from '../../actions';

const defaultSchema = {
  type: 'object',
  required: [],
  properties: {
    type: {
      title: 'Connection settings (for getting reports and remote debugging)',
      type: 'string',
      enum: ['disabled', 'remotedev', 'custom'],
      enumNames: ['no remote connection', 'connect via remotedev.io', 'use local (custom) server']
    },
    hostname: {
      type: 'string'
    },
    port: {
      type: 'number'
    },
    secure: {
      type: 'boolean'
    }
  }
};

const uiSchema = {
  type: {
    'ui:widget': 'radio'
  }
};

class Connection extends Component {
  static propTypes = {
    saveSettings: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired,
    type: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = this.setFormData(props.type);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({ formData: { ...nextProps.options, type: nextProps.type } });
    }
  }

  handleSave = data => {
    this.props.saveSettings(data.formData);
    this.setState({ changed: false });
  };

  setFormData = (type, changed) => {
    let schema;
    if (type !== 'custom') {
      schema = {
        type: 'object',
        properties: { type: defaultSchema.properties.type }
      };
    } else {
      schema = defaultSchema;
    }
    return {
      formData: {
        type,
        ...this.props.options
      },
      type,
      schema,
      changed
    };
  };

  handleChange = data => {
    const formData = data.formData;
    const type = formData.type;
    if (type !== this.state.type) {
      this.setState(this.setFormData(type, true));
    } else if (!this.state.changed) {
      this.setState({ changed: true, formData });
    }
  };

  render() {
    const type = this.state.type || 'disabled';
    const changed = this.state.changed;
    const disabled = type === 'disabled';

    return (
      <Container>
        <Form
          primaryButton={changed}
          noSubmit={disabled && !changed}
          submitText={disabled ? 'Disconnect' : 'Connect'}
          formData={this.state.formData}
          schema={this.state.schema}
          uiSchema={uiSchema}
          onChange={this.handleChange}
          onSubmit={this.handleSave}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return state.connection;
}

function mapDispatchToProps(dispatch) {
  return {
    saveSettings: bindActionCreators(saveSocketSettings, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
