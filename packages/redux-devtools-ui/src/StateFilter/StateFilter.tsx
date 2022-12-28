import React, {
  ChangeEvent,
  MouseEventHandler,
  PureComponent,
  ReactNode,
  SyntheticEvent,
} from 'react';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';

export interface StateFilterValue {
  searchString: string;
  isJsonPath: boolean;
}

export interface StateFilterProps {
  value: StateFilterValue;
  onChange: (value: Partial<StateFilterValue>) => void;
}

const FormContainer = createStyledComponent(styles, 'form');

const searchPlaceholder = 'filter state...';

export class StateFilter extends PureComponent<StateFilterProps> {
  handleSubmit = (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
  };
  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.props.onChange({
      searchString: e.currentTarget.value,
    });
  };
  toggleJSONPath: MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onChange({
      isJsonPath: !this.props.value.isJsonPath,
    });
  };
  render(): ReactNode {
    const { searchString, isJsonPath } = this.props.value;
    return (
      <FormContainer onSubmit={this.handleSubmit}>
        <input
          type="search"
          onChange={this.handleChange}
          value={searchString}
          placeholder={searchPlaceholder}
        />
        {/* <button type="reset" onClick={this.handleClear}>x</button> */}
        <button
          aria-pressed={isJsonPath}
          title="Use JSONPath to filter state"
          type="button"
          onClick={this.toggleJSONPath}
        >
          {'{;}'}
        </button>
      </FormContainer>
    );
  }
}
