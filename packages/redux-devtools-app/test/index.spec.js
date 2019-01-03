import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { mount } from 'enzyme';
// import { mountToJson } from 'enzyme-to-json';
import App from '../src/app/containers/App';
import api from '../src/app/middlewares/api';
import exportState from '../src/app/middlewares/exportState';
import rootReducer from '../src/app/reducers';
let wrapper;

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
  
  it('should render inspector monitor\'s wrapper', () => {
    expect(wrapper.find('DevtoolsInspector').html()).toBeDefined();
  });

  it('should contain an empty action list', () => {
    expect(
      wrapper.find('ActionList').findWhere(n => {
        const { className } = n.props();
        return className && className.startsWith('actionListRows-');
      }).html()
    ).toMatch(/<div class="actionListRows-[0-9]+"><\/div>/);
  });
});
