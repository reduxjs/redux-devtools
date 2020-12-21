import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mount, ReactWrapper } from 'enzyme';
// import { mountToJson } from 'enzyme-to-json';
import App from '../src/containers/App';
import api from '../src/middlewares/api';
import exportState from '../src/middlewares/exportState';
import rootReducer from '../src/reducers';
import { DATA_TYPE_KEY } from '../src/constants/dataTypes';
import stringifyJSON from '../src/utils/stringifyJSON';

let wrapper: ReactWrapper<unknown, unknown, Component>;

const store = createStore(rootReducer, applyMiddleware(exportState, api));

describe('App container', () => {
  beforeAll(() => {
    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });

  /*
  it('should render the App', () => {
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });
*/

  it("should render inspector monitor's wrapper", () => {
    expect(wrapper.find('DevtoolsInspector').html()).toBeDefined();
  });

  it('should contain an empty action list', () => {
    expect(
      wrapper
        .find('ActionList')
        .findWhere((n) => {
          const { className } = n.props();
          return className && className.startsWith('actionListRows-');
        })
        .html()
    ).toMatch(/<div class="actionListRows-\d-\d-\d+"><\/div>/);
  });
});

describe('stringifyJSON', () => {
  it('should not mutate the source object', () => {
    const src = {
      isTest: true,
      [DATA_TYPE_KEY]: 'Test',
    };

    const result = {
      data: {
        isTest: true,
      },
      __serializedType__: 'Test',
    };

    expect(stringifyJSON(src, true)).toEqual(JSON.stringify(result));
    expect(src).toEqual({
      isTest: true,
      [DATA_TYPE_KEY]: 'Test',
    });
  });
});
