import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Form } from 'devui';
import { saveSocketSettings } from '../../actions';
import { StoreState } from '../../reducers';

const defaultSchema = {
  type: 'object',
  required: [],
  properties: {
    type: {
      title: 'Connection settings (for getting reports and remote debugging)',
      type: 'string',
      enum: ['disabled', 'remotedev', 'custom'],
      enumNames: [
        'no remote connection',
        'connect via remotedev.io',
        'use local (custom) server',
      ],
    },
    hostname: {
      type: 'string',
    },
    port: {
      type: 'number',
    },
    secure: {
      type: 'boolean',
    },
  },
};

const uiSchema = {
  type: {
    'ui:widget': 'radio',
  },
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class Connection extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = this.setFormData(props.type);
  }

  shouldComponentUpdate(nextProps: Props, nextState) {
    return this.state !== nextState;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.options !== nextProps.options) {
      this.setState({
        formData: { ...nextProps.options, type: nextProps.type },
      });
    }
  }

  handleSave = (data) => {
    this.props.saveSettings(data.formData);
    this.setState({ changed: false });
  };

  setFormData = (type, changed) => {
    let schema;
    if (type !== 'custom') {
      schema = {
        type: 'object',
        properties: { type: defaultSchema.properties.type },
      };
    } else {
      schema = defaultSchema;
    }
    return {
      formData: {
        type,
        ...this.props.options,
      },
      type,
      schema,
      changed,
    };
  };

  handleChange = (data) => {
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

const mapStateToProps = (state: StoreState) => state.connection;

const actionCreators = {
  saveSettings: saveSocketSettings,
};

export default connect(mapStateToProps, actionCreators)(Connection);
