import React, { ReactElement, useEffect, useState } from 'react';
import { StylingFunction } from 'react-base16-styling';
import { searchInObject } from '../utils/objectSearch';
import { Value } from '../utils/searchWorker';
import JumpSearchResultButton, {
  BUTTON_DIRECTION,
} from './JumpSearchResultButton';
import SearchBar from './SearchBar';

export interface SearchQuery {
  queryText: string;
  location: {
    keys: boolean;
    values: boolean;
  };
}

const INITIAL_QUERY: SearchQuery = {
  queryText: '',
  location: {
    keys: true,
    values: true,
  },
};

export interface SearchPanelProps {
  state: Value;
  onSubmit: (result: {
    searchResult: string[];
    searchInProgress: boolean;
  }) => void;
  onReset: () => void;
  styling: StylingFunction;
}

type SearchStatus = 'done' | 'pending' | 'unset';

function SearchPanel({
  onSubmit,
  onReset,
  styling,
  state,
}: SearchPanelProps): ReactElement {
  const [query, setQuery] = useState<SearchQuery>(INITIAL_QUERY);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>('unset');
  const [results, setResults] = useState<string[][] | undefined>(undefined);
  const [resultIndex, setResultIndex] = useState(0);

  async function handleSubmit() {
    setSearchStatus('pending');
    const result = await searchInObject(state, query);
    setResults(result.map((r) => r.split('.')));
    setResultIndex(0);
    setSearchStatus('done');
  }

  function reset() {
    setQuery(INITIAL_QUERY);
    setSearchStatus('unset');
    setResults(undefined);
    setResultIndex(0);
    onReset();
  }

  useEffect(() => {
    results &&
      onSubmit({ searchResult: results[0] || [], searchInProgress: true });
  }, [results, onSubmit]);

  return (
    <div className={'search-panel'} {...styling('searchPanel')}>
      <SearchBar
        text={query.queryText}
        onChange={(text: string) => setQuery({ ...query, queryText: text })}
        styling={styling}
      />
      <div>
        <input
          {...styling('searchPanelParameterSelection')}
          type={'checkbox'}
          checked={query.location.keys}
          onChange={(event) =>
            setQuery({
              ...query,
              location: { ...query.location, keys: event.target.checked },
            })
          }
        />
        <span>Keys</span>
      </div>
      <div>
        <input
          {...styling('searchPanelParameterSelection')}
          type={'checkbox'}
          checked={query.location.values}
          onChange={(event) =>
            setQuery({
              ...query,
              location: { ...query.location, values: event.target.checked },
            })
          }
        />
        <span>Values</span>
      </div>
      <button
        {...styling('searchButton')}
        onClick={() => handleSubmit()}
        disabled={
          (!query.location.keys && !query.location.values) || !query.queryText
        }
      >
        Go
      </button>
      {searchStatus === 'pending' && 'Searching...'}
      {searchStatus === 'done' && (
        <>
          <div {...styling('jumpResultContainer')}>
            <JumpSearchResultButton
              buttonDirection={BUTTON_DIRECTION.LEFT}
              buttonDisabled={!results || results.length < 2}
              styling={styling}
              jumpToNewResult={() => {
                if (!results) {
                  return;
                }
                const newIndex =
                  resultIndex - 1 < 0 ? results.length - 1 : resultIndex - 1;
                setResultIndex(newIndex);
                onSubmit({
                  searchResult: results[newIndex] || [],
                  searchInProgress: true,
                });
              }}
            />
            <JumpSearchResultButton
              buttonDirection={BUTTON_DIRECTION.RIGHT}
              buttonDisabled={!results || results.length < 2}
              styling={styling}
              jumpToNewResult={() => {
                if (!results) {
                  return;
                }
                const newIndex = (resultIndex + 1) % results.length || 0;
                setResultIndex(newIndex);
                onSubmit({
                  searchResult: results[newIndex] || [],
                  searchInProgress: true,
                });
              }}
            />
            {results &&
              `${results.length ? resultIndex + 1 : 0}/${results.length}`}
          </div>
          <button {...styling('searchButton')} onClick={() => reset()}>
            Reset
          </button>
        </>
      )}
    </div>
  );
}

export default SearchPanel;
