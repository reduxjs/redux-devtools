import React, { ReactNode, FormEvent, MouseEvent, ChangeEvent } from 'react';
import type { DebouncedFunc } from 'lodash';
import { css } from '@emotion/react';
import { Select } from '@redux-devtools/ui';
import { QueryFormValues } from '../types';
import { StyleUtilsContext } from '../styles/themes';
import { SelectOption } from '../types';
import debounce from 'lodash.debounce';
import { sortQueryOptions, QueryComparators } from '../utils/comparators';
import { QueryFilters, filterQueryOptions } from '../utils/filters';
import { SortOrderButton } from './SortOrderButton';
import { RegexIcon } from './RegexIcon';

const srOnlyCss = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: 0,
});

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
    option: SelectOption<QueryComparators> | undefined | null,
  ): void => {
    if (typeof option?.value === 'string') {
      this.props.onFormValuesChange({ queryComparator: option.value });
    }
  };

  handleSelectFilterChange = (
    option: SelectOption<QueryFilters> | undefined | null,
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

  invalidateSearchValueFromProps: DebouncedFunc<() => void> = debounce(() => {
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
        {({ base16Theme }) => {
          return (
            <form
              id="rtk-query-monitor-query-selection-form"
              action="#"
              onSubmit={this.handleSubmit}
              css={{
                display: 'flex',
                flexFlow: 'column nowrap',
              }}
            >
              <div
                css={(theme) => ({
                  display: 'flex',
                  padding: 4,
                  flex: '0 0 auto',
                  alignItems: 'center',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',

                  borderColor: theme.LIST_BORDER_COLOR,
                })}
              >
                <label htmlFor={searchId} css={srOnlyCss}>
                  filter query
                </label>
                <div
                  css={(theme) => ({
                    maxWidth: '65%',
                    backgroundColor: theme.BACKGROUND_COLOR,
                    display: 'flex',
                    alignItems: 'center',
                    flexFlow: 'row nowrap',
                    flex: '1 1 auto',
                    paddingRight: 6,
                    '& input': {
                      outline: 'none',
                      border: 'none',
                      width: '100%',
                      flex: '1 1 auto',
                      padding: '5px 10px',
                      fontSize: '1em',
                      position: 'relative',
                      fontFamily:
                        'monaco, Consolas, "Lucida Console", monospace',

                      backgroundColor: theme.BACKGROUND_COLOR,
                      color: theme.TEXT_COLOR,

                      '&::-webkit-input-placeholder': {
                        color: theme.TEXT_PLACEHOLDER_COLOR,
                      },

                      '&::-moz-placeholder': {
                        color: theme.TEXT_PLACEHOLDER_COLOR,
                      },
                      '&::-webkit-search-cancel-button': {
                        WebkitAppearance: 'none',
                      },
                    },
                  })}
                >
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
                    css={(theme) => ({
                      WebkitAppearance: 'none',
                      border: 'none',
                      outline: 'none',
                      boxShadow: 'none',
                      display: 'block',
                      flex: '0 0 auto',
                      cursor: 'pointer',
                      background: 'transparent',
                      position: 'relative',
                      fontSize: 'inherit',
                      '&[data-invisible="1"]': {
                        visibility: 'hidden !important' as 'hidden',
                      },
                      '&::after': {
                        content: '"\u00d7"',
                        display: 'block',
                        padding: 4,
                        fontSize: '1.2em',
                        color: theme.TEXT_PLACEHOLDER_COLOR,
                        background: 'transparent',
                      },
                      '&:hover::after': {
                        color: theme.TEXT_COLOR,
                      },
                    })}
                  />
                  <button
                    type="button"
                    aria-label={regexToggleLabel}
                    title={regexToggleLabel}
                    data-type={regexToggleType}
                    aria-pressed={isRegexSearch}
                    onClick={this.handleRegexSearchClick}
                    css={(theme) => ({
                      width: '24px',
                      height: '24px',
                      display: 'inline-block',
                      flex: '0 0 auto',
                      color: theme.TEXT_PLACEHOLDER_COLOR,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: '0.7em',
                      letterSpacing: '-0.7px',
                      outline: 'none',
                      boxShadow: 'none',
                      fontWeight: '700',
                      border: 'none',

                      '&:hover': {
                        color: theme.TEXT_COLOR,
                      },

                      backgroundColor: 'transparent',
                      '&[aria-pressed="true"]': {
                        color: theme.BACKGROUND_COLOR,
                        backgroundColor: theme.TEXT_COLOR,
                      },

                      '&[data-type="error"]': {
                        color: theme.TEXT_COLOR,
                        backgroundColor: theme.TOGGLE_BUTTON_ERROR,
                      },
                    })}
                  >
                    <RegexIcon />
                  </button>
                </div>
                <label htmlFor={selectId} css={srOnlyCss}>
                  filter by
                </label>
                <Select<SelectOption<QueryFilters>>
                  id={filterSelectId}
                  isSearchable={false}
                  options={filterQueryOptions}
                  theme={base16Theme as any}
                  value={filterQueryOptions.find(
                    (opt) => opt?.value === queryFilter,
                  )}
                  onChange={this.handleSelectFilterChange}
                />
              </div>
              <div
                css={{
                  display: 'flex',
                  padding: '0.4em',
                  '& label': {
                    display: 'flex',
                    flex: '0 0 auto',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                    paddingRight: '0.4em',
                  },

                  '& > :last-child': {
                    flex: '0 0 auto',
                    marginLeft: '0.4em',
                  },
                }}
              >
                <label htmlFor={selectId}>Sort by</label>
                <Select<SelectOption<QueryComparators>>
                  id={selectId}
                  isSearchable={false}
                  theme={base16Theme as any}
                  value={sortQueryOptions.find(
                    (opt) => opt?.value === queryComparator,
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
