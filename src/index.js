const instrument = require('./instrument');
const persistState = require('./persistState');
const createDevTools = require('./createDevTools');

module.exports = {
    instrument,
    ActionCreators: instrument.ActionCreators,
    ActionTypes: instrument.ActionTypes,
    persistState,
    createDevTools
};
