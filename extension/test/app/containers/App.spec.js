import expect from 'expect';
import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from '../../../src/app/stores/windowStore';
import App from '../../../src/app/containers/App.js';

const store = configureStore(store);
const component = mount(<Provider store={store}><App position="devtools-left" /></Provider>);

describe('App container', () => {
  it('should render inspector monitor\'s component', () => {
    expect(component.find('DevtoolsInspector').html()).toExist();
  });

  it('should contain an empty action list', () => {
    expect(
      component.find('ActionList').html()
    ).toMatch(/<div class="actionListRows-[0-9]+"><\/div>/);
  });
});
