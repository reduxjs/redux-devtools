import React, { ReactNode, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { QueryFormValues } from '../types';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { Select } from 'devui';
import { SelectOption } from '../types';
import { AnyAction } from 'redux';
import debounce from 'lodash.debounce';
import { sortQueryOptions, QueryComparators } from '../utils/comparators';

export interface QueryFormProps {
  dispatch: (action: AnyAction) => void;
  values: QueryFormValues;
  onFormValuesChange: (values: Partial<QueryFormValues>) => void;
}

interface QueryFormState {
  searchValue: string;
}

const ascId = 'rtk-query-rb-asc';
const descId = 'rtk-query-rb-desc';
const selectId = 'rtk-query-comp-select';
const searchId = 'rtk-query-search-query';

const searchPlaceholder = 'filter query...';

export class QueryForm extends React.PureComponent<
  QueryFormProps,
  QueryFormState
> {
  constructor(props: QueryFormProps) {
    super(props);

    this.state = {
      searchValue: props.values.searchValue,
    };
  }

  inputSearchRef = React.createRef<HTMLInputElement>();

  handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
    evt.preventDefault();
  };

  handleButtonGroupClick = ({ target }: MouseEvent<HTMLElement>): void => {
    const {
      values: { isAscendingQueryComparatorOrder: isAsc },
      onFormValuesChange,
    } = this.props;

    const targetId = (target as HTMLElement)?.id ?? null;

    if (targetId === ascId && !isAsc) {
      onFormValuesChange({ isAscendingQueryComparatorOrder: true });
    } else if (targetId === descId && isAsc) {
      onFormValuesChange({ isAscendingQueryComparatorOrder: false });
    }
  };

  handleSelectComparator = (
    option: SelectOption<QueryComparators> | undefined | null
  ): void => {
    if (typeof option?.value === 'string') {
      this.props.onFormValuesChange({ queryComparator: option.value });
    }
  };

  restoreCaretPosition = (start: number | null, end: number | null): void => {
    window.requestAnimationFrame(() => {
      if (this.inputSearchRef.current) {
        this.inputSearchRef.current.selectionStart = start;
        this.inputSearchRef.current.selectionEnd = end;
      }
    });
  };

  invalidateSearchValueFromProps = debounce(() => {
    this.props.onFormValuesChange({
      searchValue: this.state.searchValue,
    });
  }, 150);

  handleSearchChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    const searchValue = evt.target.value.trim();
    this.setState({ searchValue });
    this.invalidateSearchValueFromProps();
  };

  render(): ReactNode {
    const {
      values: { isAscendingQueryComparatorOrder: isAsc, queryComparator },
    } = this.props;

    const isDesc = !isAsc;

    return (
      <StyleUtilsContext.Consumer>
        {({ styling, base16Theme }) => {
          return (
            <form
              action="#"
              onSubmit={this.handleSubmit}
              {...styling('queryForm')}
            >
              <div {...styling('queryListHeader')}>
                <label htmlFor={searchId} {...styling('srOnly')}>
                  filter query
                </label>
                <input
                  ref={this.inputSearchRef}
                  type="search"
                  value={this.state.searchValue}
                  onChange={this.handleSearchChange}
                  placeholder={searchPlaceholder}
                  {...styling('querySearch')}
                />
              </div>
              <div {...styling('sortBySection')}>
                <label htmlFor={selectId}>Sort by</label>
                <Select<SelectOption<QueryComparators>>
                  id={selectId}
                  isSearchable={false}
                  theme={base16Theme as any}
                  value={sortQueryOptions.find(
                    (opt) => opt?.value === queryComparator
                  )}
                  options={sortQueryOptions}
                  onChange={this.handleSelectComparator}
                />
                <div
                  tabIndex={0}
                  role="radiogroup"
                  aria-activedescendant={isAsc ? ascId : descId}
                  onClick={this.handleButtonGroupClick}
                >
                  <button
                    role="radio"
                    type="button"
                    id={ascId}
                    aria-checked={isAsc}
                    {...styling(
                      ['selectorButton', isAsc && 'selectorButtonSelected'],
                      isAsc
                    )}
                  >
                    asc
                  </button>
                  <button
                    id={descId}
                    role="radio"
                    type="button"
                    aria-checked={isDesc}
                    {...styling(
                      ['selectorButton', isDesc && 'selectorButtonSelected'],
                      isDesc
                    )}
                  >
                    desc
                  </button>
                </div>
              </div>
            </form>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
