var jsan = require('jsan');
var serialize = require('./serialize');
var options = require('../constants/options');

module.exports = function (Immutable, refs, customReplacer, customReviver) {
  return {
    stringify: function (data) {
      return jsan.stringify(
        data,
        serialize(Immutable, refs, customReplacer, customReviver).replacer,
        null,
        options
      );
    },
    parse: function (data) {
      return jsan.parse(
        data,
        serialize(Immutable, refs, customReplacer, customReviver).reviver
      );
    },
    serialize: serialize,
  };
};
