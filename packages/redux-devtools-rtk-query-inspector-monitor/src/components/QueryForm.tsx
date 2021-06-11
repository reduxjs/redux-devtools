import React, { ReactNode, FormEvent, MouseEvent } from 'react';
import { RtkQueryInspectorMonitorState } from '../types';
import { StyleUtilsContext } from '../styles/createStylingFromTheme';
import { Select } from 'devui';
import { AnyAction } from 'redux';
import { sortQueryOptions, QueryComparators } from '../utils/comparators';
import {
  changeIsAscendingQueryComparatorOrder,
  changeQueryComparator,
} from '../reducers';
export interface QueryFormProps
  extends Pick<
    RtkQueryInspectorMonitorState,
    'isAscendingQueryComparatorOrder' | 'queryComparator'
  > {
  dispatch: (action: AnyAction) => void;
}

const ascId = 'rtk-query-rb-asc';
const descId = 'rtk-query-rb-desc';
const selectId = 'rtk-query-comp-select';
const searchId = 'rtk-query-search-query';

const searchPlaceholder = 'filter query...';

export class QueryForm extends React.PureComponent<QueryFormProps> {
  handleSubmit = (evt: FormEvent<HTMLFormElement>): void => {
    evt.preventDefault();
  };

  handleButtonGroupClick = ({ target }: MouseEvent<HTMLElement>): void => {
    const { isAscendingQueryComparatorOrder: isAsc, dispatch } = this.props;

    const targetId = (target as HTMLElement)?.id ?? null;

    if (targetId === ascId && !isAsc) {
      dispatch(changeIsAscendingQueryComparatorOrder(true));
    } else if (targetId === descId && isAsc) {
      this.props.dispatch(changeIsAscendingQueryComparatorOrder(false));
    }
  };

  handleSelectComparator = (option: { value: string }): void => {
    const { dispatch } = this.props;

    if (typeof option?.value === 'string') {
      dispatch(changeQueryComparator(option.value as QueryComparators));
    }
  };

  getSelectedOption = (option: { value: string }): string => option?.value;

  render(): ReactNode {
    const {
      isAscendingQueryComparatorOrder: isAsc,
      queryComparator,
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
                  type="search"
                  placeholder={searchPlaceholder}
                  {...styling('querySearch')}
                />
              </div>
              <div {...styling('sortBySection')}>
                <label htmlFor={selectId}>Sort by</label>
                <Select
                  id={selectId}
                  isSearchable={false}
                  openOuterUp
                  theme={base16Theme}
                  value={sortQueryOptions.find(
                    (opt) => opt?.value === queryComparator
                  )}
                  options={sortQueryOptions}
                  onChange={this.handleSelectComparator}
                  selectOption={this.getSelectedOption}
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
