import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Form } from '@redux-devtools/ui';
import { JSONSchema7Definition, JSONSchema7TypeName } from 'json-schema';
import { ConnectionType, saveSocketSettings } from '../../actions';
import { StoreState } from '../../reducers';
import { ConnectionStateOptions } from '../../reducers/connection';
import { IChangeEvent } from '@rjsf/core';

declare module 'json-schema' {
  export interface JSONSchema7 {
    enumNames?: JSONSchema7Type[];
  }
}

interface Schema {
  type: JSONSchema7TypeName;
  required?: string[];
  properties: {
    [key: string]: JSONSchema7Definition;
  };
}

const defaultSchema: Schema = {
  type: 'object',
  required: [],
  properties: {
    type: {
      title: 'Connection settings (for getting reports and remote debugging)',
      type: 'string',
      enum: ['disabled', 'custom'],
      enumNames: ['no remote connection', 'use local (custom) server'],
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

interface FormData extends ConnectionStateOptions {
  readonly type: ConnectionType;
}

interface State {
  readonly formData: FormData;
  readonly type: ConnectionType;
  readonly schema: Schema;
  readonly changed: boolean | undefined;
}

export class Connection extends Component<Props, State> {
  setFormData = (type: ConnectionType, changed?: boolean) => {
    let schema: Schema;
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

  state: State = this.setFormData(this.props.type);

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return this.state !== nextState;
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (this.props.options !== nextProps.options) {
      this.setState({
        formData: { ...nextProps.options, type: nextProps.type },
      });
    }
  }

  handleSave = (data: IChangeEvent<FormData>) => {
    this.props.saveSettings(data.formData!);
    this.setState({ changed: false });
  };

  handleChange = (data: IChangeEvent<FormData>) => {
    const formData = data.formData!;
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
