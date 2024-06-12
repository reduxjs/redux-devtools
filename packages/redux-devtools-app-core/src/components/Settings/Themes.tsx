import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Form } from '@redux-devtools/ui';
import { listSchemes, listThemes } from '@redux-devtools/ui';
import { changeTheme } from '../../actions';
import { CoreStoreState } from '../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

export class Themes extends Component<Props> {
  render() {
    const theme = this.props.theme;
    const formData = {
      theme: theme.theme,
      scheme: theme.scheme,
      colorPreference: theme.colorPreference,
    };

    return (
      <Container>
        <Form
          schema={{
            type: 'object',
            properties: {
              theme: {
                type: 'string',
                enum: listThemes(),
              },
              scheme: {
                title: 'color scheme',
                type: 'string',
                enum: listSchemes(),
              },
              colorPreference: {
                title: 'theme color',
                type: 'string',
                enum: ['auto', 'light', 'dark'],
              },
            },
          }}
          formData={formData}
          noSubmit
          onChange={this.props.changeTheme}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => ({
  theme: state.theme,
});

const actionCreators = {
  changeTheme,
};

export default connect(mapStateToProps, actionCreators)(Themes);
