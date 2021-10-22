import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from '../../../src/app/stores/windowStore';
import App from '../../../src/app/containers/App';

const { store } = configureStore(store);

describe('App container', () => {
  it("should render inspector monitor's component", () => {
    render(
      <Provider store={store}>
        <App position="devtools-left" />
      </Provider>
    );
    expect(screen.getByTestId('inspector')).toBeDefined();
  });

  it('should contain an empty action list', () => {
    render(
      <Provider store={store}>
        <App position="devtools-left" />
      </Provider>
    );
    const actionList = screen.getByTestId('actionList');
    expect(
      within(actionList).getByTestId('actionListRows')
    ).toBeEmptyDOMElement();
  });
});
