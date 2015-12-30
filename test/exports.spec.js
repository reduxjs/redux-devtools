const expect = require('expect');

const { instrument, ActionCreators, ActionTypes, persistState, createDevTools} = require('../src');

describe('exports are the correct types', () => {
  it('instrument', () => {
    expect(instrument).toBeA('function');
  });
  it('ActionCreators', () => {
    expect(ActionCreators).toBeA('object');
  });
  it('ActionTypes', () => {
    expect(ActionTypes).toBeA('object');
  });
  it('persistState', () => {
    expect(persistState).toBeA('function');
  });
  it('createDevTools', () => {
    expect(createDevTools).toBeA('function');
  });
});
