import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { MdWarning } from 'react-icons/md';
import { MdError } from 'react-icons/md';
import { MdCheckCircle } from 'react-icons/md';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';

const NotificationWrapper = createStyledComponent(styles);

export default class Notification extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.type !== this.props.type
    );
  }

  getIcon = () => {
    switch (this.props.type) {
      case 'warning':
        return <MdWarning />;
      case 'error':
        return <MdError />;
      case 'success':
        return <MdCheckCircle />;
      default:
        return null;
    }
  };

  render() {
    return (
      <NotificationWrapper type={this.props.type} theme={this.props.theme}>
        {this.getIcon()}
        <span>{this.props.children}</span>
        {this.props.onClose && (
          <button onClick={this.props.onClose}>
            <MdClose />
          </button>
        )}
      </NotificationWrapper>
    );
  }
}

Notification.propTypes = {
  children: PropTypes.any.isRequired,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  onClose: PropTypes.func,
  theme: PropTypes.object,
};

Notification.defaultProps = {
  type: 'info',
};
