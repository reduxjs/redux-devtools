var makeExecutableSchema = require('graphql-tools').makeExecutableSchema;
var requireSchema = require('../utils/requireSchema');
var schema = requireSchema('./schema_def.graphql', require);

var resolvers = {
  Query: {
    reports: function report(source, args, context, ast) {
      return context.store.listAll();
    },
    report: function report(source, args, context, ast) {
      return context.store.get(args.id);
    }
  }
};

var executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers
});

module.exports = executableSchema;
