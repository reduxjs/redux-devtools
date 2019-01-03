var fs = require('fs');

module.exports = function(name, require) {
  return fs.readFileSync(require.resolve(name)).toString();
  // return GraphQL.buildSchema(schema);
};
