import React, {
  ChangeEventHandler,
  Component,
  FocusEventHandler,
  KeyboardEventHandler,
} from 'react';
import classnames from 'classnames';

interface State {
  text: string;
}

interface Props {
  onSave: (text: string) => void;
  text?: string;
  placeholder?: string;
  editing?: boolean;
  newTodo?: boolean;
}

export default class TodoTextInput extends Component<Props, State> {
  static defaultProps = {
    text: '',
    placeholder: '',
    editing: false,
    newTodo: false,
  };

  state = {
    text: this.props.text || '',
  };

  handleSubmit: KeyboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.currentTarget.value.trim();
    if (e.which === 13) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  };

  handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    this.setState({ text: e.target.value });
  };

  handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    if (!this.props.newTodo) {
      this.props.onSave(e.target.value);
    }
  };

  render() {
    return (
      <input
        className={classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo,
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus={true}
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
