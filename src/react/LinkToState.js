import React, { PropTypes, Component } from 'react';
import { getUrlForState } from '../urlState';

const styles = {
  link: {
    color: '#6FB3D2'
  }
};

export default class LinkToState extends Component {
  static propTypes = {
    fullAppState: PropTypes.object.isRequired
  };

  render() {
    const urlForState = getUrlForState(this.props.fullAppState);
    return <a style={{...styles.link}} href={urlForState}>
      Current State
    </a>;
  }
}
