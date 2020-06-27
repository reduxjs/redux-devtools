import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from 'react-icons/lib/md/close';
import WarningIcon from 'react-icons/lib/md/warning';
import ErrorIcon from 'react-icons/lib/md/error';
import SuccessIcon from 'react-icons/lib/md/check-circle';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';
import { Theme } from '../themes/default';

const NotificationWrapper = createStyledComponent(styles);

export type Type = 'info' | 'success' | 'warning' | 'error';

interface Props {
  children?: React.ReactNode;
  type: Type;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  theme?: Theme;
}

export default class Notification extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.children !== this.props.children ||
      nextProps.type !== this.props.type
    );
  }

  getIcon = () => {
    switch (this.props.type) {
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'success':
        return <SuccessIcon />;
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
            <CloseIcon />
          </button>
        )}
      </NotificationWrapper>
    );
  }

  static propTypes = {
    children: PropTypes.any.isRequired,
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
    onClose: PropTypes.func,
    theme: PropTypes.object
  };

  static defaultProps = {
    type: 'info'
  };
}
