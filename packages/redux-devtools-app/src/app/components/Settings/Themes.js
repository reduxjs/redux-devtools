import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Form, Button } from 'devui';
import { listSchemes, listThemes } from 'devui/lib/utils/theme';
import { changeTheme } from '../../actions';

class Themes extends Component {
  static propTypes = {
    changeTheme: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired
  };

  render() {
    const theme = this.props.theme;
    const formData = {
      theme: theme.theme,
      scheme: theme.scheme,
      dark: !theme.light
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
              dark: {
                type: 'boolean'
              }
            }
          }}
          formData={formData}
          noSubmit
          onChange={this.props.changeTheme}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    theme: state.theme
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeTheme: bindActionCreators(changeTheme, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Themes);
