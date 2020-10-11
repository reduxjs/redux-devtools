var ApolloServer = require('apollo-server-express').ApolloServer;
var schema = require('../api/schema');

module.exports = function (store) {
  return new ApolloServer({
    schema,
    context: {
      store: store,
    },
    playground: {
      endpoint: '/graphql',
      tabs: [
        {
          endpoint: '/graphql',
          query:
            '{\n' +
            '  reports {\n' +
            '    id,\n' +
            '    type,\n' +
            '    title\n' +
            '  }\n' +
            '}',
        },
      ],
    },
  });
};
