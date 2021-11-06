import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { render, screen, within } from '@testing-library/react';
import App from '../src/containers/App';
import api from '../src/middlewares/api';
import exportState from '../src/middlewares/exportState';
import rootReducer from '../src/reducers';
import { DATA_TYPE_KEY } from '../src/constants/dataTypes';
import stringifyJSON from '../src/utils/stringifyJSON';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const store = createStore(rootReducer, applyMiddleware(exportState, api));

describe('App container', () => {
  it("should render inspector monitor's wrapper", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByTestId('inspector')).toBeDefined();
  });

  it('should contain an empty action list', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const actionList = screen.getByTestId('actionList');
    expect(
      within(actionList).getByTestId('actionListRows')
    ).toBeEmptyDOMElement();
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
