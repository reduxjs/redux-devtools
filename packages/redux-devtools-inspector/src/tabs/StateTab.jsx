import React, { Component } from 'react';
import JSONTree from 'react-json-tree';
import getItemString from './getItemString';
import getJsonTreeTheme from './getJsonTreeTheme';
import objectMap from '../utils/objectMap';
import flatten from 'flat';

class StateTab extends Component {
  state = { searchQuery: '',  filteredState: this.props.nextState, isShowingFullPath: false }

  onFilteringState = (e) => {
    this.setState({
      searchQuery: e.target.value,
    }, () => {
      const { searchQuery } = this.state
      const { nextState } = this.props;
      this.setState({
        filteredState: searchQuery.length
          ? objectMap(
            flatten(nextState),
            (value, key) => ({
              value,
              key
            }))
            .filter(item => item.key.indexOf(searchQuery) !== -1)
            .reduce((acc, current) => {
              if (this.state.isShowingFullPath) {
                acc[current.key] = current.value;
                return acc
              }
              if (current.key.includes('.')) {
                const pathHash = current.key.split('.');
                /\d/.test(current.key)
                  ? acc[current.key] = current.value
                  : acc[pathHash[pathHash.length - 1]] = current.value
                return acc
              }
              acc[current.key] = current.value;
              return acc;
            }, {}) : nextState
      });
    });
  }

  toggleShowFullPath = () => {
    this.setState(({ isShowingFullPath }) => ({
      isShowingFullPath: !isShowingFullPath
    }));
  }

  render() {
    const {
      styling,
      base16Theme,
      invertTheme,
      labelRenderer,
      dataTypeKey,
      isWideLayout,
    } = this.props
    return (
      <div>
        <div {...styling('stateFilter')}>
          <input
            {...styling('actionListHeaderSearch')}
            placeholder='filter...'
            onChange={this.onFilteringState}
            value={this.state.searchQuery}
          />
          <div
            onClick={this.toggleShowFullPath}
            {...styling('stateButtonFullPath')}
            style={{ backgroundColor: this.state.isShowingFullPath
              ? 'rgba(142, 141, 142, 0.4)'
              : 'inherit' }}
          >
            Full path
          </div>
        </div>
        <JSONTree
          labelRenderer={labelRenderer}
          theme={getJsonTreeTheme(base16Theme)}
          data={this.state.filteredState}
          getItemString={(type, data) =>
            getItemString(styling, type, data, dataTypeKey, isWideLayout)}
          invertTheme={invertTheme}
          hideRoot
        />
      </div>
    )
  }
}

export default StateTab;
