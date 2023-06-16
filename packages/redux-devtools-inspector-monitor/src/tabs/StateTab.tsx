import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { JSONTree } from 'react-json-tree';
import { Action } from 'redux';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import { TabComponentProps } from '../ActionPreview';
import SearchPanel from '../searchPanel/SearchPanel';

const StateTab: React.FunctionComponent<
  TabComponentProps<any, Action<unknown>>
> = ({
  nextState,
  styling,
  base16Theme,
  invertTheme,
  labelRenderer,
  dataTypeKey,
  isWideLayout,
  sortStateTreeAlphabetically,
  disableStateTreeCollection,
}) => {
  interface SearchState {
    searchResult: string[];
    searchInProgress: boolean;
  }
  const [searchState, setSearchState] = useState<SearchState>({
    searchResult: [],
    searchInProgress: false,
  });

  const displayedResult = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchState.searchInProgress && displayedResult.current) {
      displayedResult.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      setSearchState({ ...searchState, searchInProgress: false });
    }
  }, [searchState, setSearchState]);

  return (
    <>
      <SearchPanel
        onSubmit={setSearchState}
        onReset={() =>
          setSearchState({
            searchResult: [],
            searchInProgress: false,
          })
        }
        styling={styling}
        state={nextState}
      />
      <JSONTree
        labelRenderer={(keyPath, nodeType, expanded, expandable) => {
          return isMatch(searchState.searchResult, [...keyPath].reverse()) ? (
            <span {...styling('queryResultLabel')} ref={displayedResult}>
              {labelRenderer(keyPath, nodeType, expanded, expandable)}
            </span>
          ) : (
            labelRenderer(keyPath, nodeType, expanded, expandable)
          );
        }}
        theme={getJsonTreeTheme(base16Theme)}
        data={nextState}
        getItemString={(type, data) =>
          getItemString(styling, type, data, dataTypeKey, isWideLayout)
        }
        invertTheme={invertTheme}
        hideRoot
        sortObjectKeys={sortStateTreeAlphabetically}
        {...(disableStateTreeCollection ? { collectionLimit: 0 } : {})}
        isSearchInProgress={searchState.searchInProgress}
        searchResultPath={searchState.searchResult}
        valueRenderer={(raw, value, ...keyPath) => {
          return isMatch(searchState.searchResult, [...keyPath].reverse()) ? (
            <span {...styling('queryResult')} ref={displayedResult}>
              {raw as string}
            </span>
          ) : (
            <span>{raw as string}</span>
          );
        }}
      />
    </>
  );
};

const isMatch = (resultPath: string[], nodePath: (string | number)[]) => {
  return (
    resultPath.length === nodePath.length &&
    resultPath.every((result, index) => result === nodePath[index].toString())
  );
};

StateTab.propTypes = {
  nextState: PropTypes.any.isRequired,
  styling: PropTypes.func.isRequired,
  base16Theme: PropTypes.any.isRequired,
  invertTheme: PropTypes.bool.isRequired,
  labelRenderer: PropTypes.func.isRequired,
  dataTypeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.symbol]),
  isWideLayout: PropTypes.bool.isRequired,
};

export default StateTab;
