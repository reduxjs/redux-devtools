import React, { ReactNode, FormEvent, MouseEvent, ChangeEvent } from 'react';
import { QueryFormValues } from '../types';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { Select } from 'devui';
import { SelectOption } from '../types';
import debounce from 'lodash.debounce';
import { sortQueryOptions, QueryComparators } from '../utils/comparators';
import { QueryFilters, filterQueryOptions } from '../utils/filters';
import { SortOrderButton } from './SortOrderButton';
import { RegexIcon } from './RegexIcon';

export interface QueryFormProps {
  values: QueryFormValues;
  searchQueryRegex: RegExp | null;
  onFormValuesChange: (values: Partial<QueryFormValues>) => void;
}

interface QueryFormState {
  searchValue: string;
}

const selectId = 'rtk-query-comp-select';
const searchId = 'rtk-query-search-query';
const filterSelectId = 'rtk-query-search-query-select';
const searchPlaceholder = 'filter query by...';

const labels = {
  regexToggle: {
    info: 'Use regular expression search',
    error: 'Invalid regular expression provided',
  },
};

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

  handleButtonGroupClick = (isAsc: boolean): void => {
    this.props.onFormValuesChange({ isAscendingQueryComparatorOrder: isAsc });
  };

  handleSelectComparatorChange = (
    option: SelectOption<QueryComparators> | undefined | null
  ): void => {
    if (typeof option?.value === 'string') {
      this.props.onFormValuesChange({ queryComparator: option.value });
    }
  };

  handleSelectFilterChange = (
    option: SelectOption<QueryFilters> | undefined | null
  ): void => {
    if (typeof option?.value === 'string') {
      this.props.onFormValuesChange({ queryFilter: option.value });
    }
  };

  handleRegexSearchClick = (): void => {
    this.props.onFormValuesChange({
      isRegexSearch: !this.props.values.isRegexSearch,
    });
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

  handleClearSearchClick = (evt: MouseEvent<HTMLButtonElement>): void => {
    evt.preventDefault();

    if (this.state.searchValue) {
      this.setState({ searchValue: '' });
      this.invalidateSearchValueFromProps();
    }
  };

  render(): ReactNode {
    const {
      searchQueryRegex,
      values: {
        isAscendingQueryComparatorOrder: isAsc,
        queryComparator,
        searchValue,
        queryFilter,
        isRegexSearch,
      },
    } = this.props;

    const isRegexInvalid =
      isRegexSearch && searchValue.length > 0 && searchQueryRegex == null;
    const regexToggleType = isRegexInvalid ? 'error' : 'info';
    const regexToggleLabel = labels.regexToggle[regexToggleType];

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
                <div {...styling('querySearch')}>
                  <input
                    ref={this.inputSearchRef}
                    type="search"
                    value={this.state.searchValue}
                    onChange={this.handleSearchChange}
                    placeholder={searchPlaceholder}
                  />
                  <button
                    type="reset"
                    aria-label="clear search"
                    data-invisible={
                      +(this.state.searchValue.length === 0) || undefined
                    }
                    onClick={this.handleClearSearchClick}
                    {...styling('closeButton')}
                  />
                  <button
                    type="button"
                    aria-label={regexToggleLabel}
                    title={regexToggleLabel}
                    data-type={regexToggleType}
                    aria-pressed={isRegexSearch}
                    onClick={this.handleRegexSearchClick}
                    {...styling('toggleButton')}
                  >
                    <RegexIcon />
                  </button>
                </div>
                <label htmlFor={selectId} {...styling('srOnly')}>
                  filter by
                </label>
                <Select<SelectOption<QueryFilters>>
                  id={filterSelectId}
                  isSearchable={false}
                  options={filterQueryOptions}
                  theme={base16Theme as any}
                  value={filterQueryOptions.find(
                    (opt) => opt?.value === queryFilter
                  )}
                  onChange={this.handleSelectFilterChange}
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
                  onChange={this.handleSelectComparatorChange}
                />
                <SortOrderButton
                  id={'rtk-query-sort-order-button'}
                  isAsc={isAsc}
                  onChange={this.handleButtonGroupClick}
                />
              </div>
            </form>
          );
        }}
      </StyleUtilsContext.Consumer>
    );
  }
}
