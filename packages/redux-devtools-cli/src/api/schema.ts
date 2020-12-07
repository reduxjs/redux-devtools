import fs from 'fs';
import { makeExecutableSchema } from 'apollo-server';
import { Store } from '../store';

const schema = fs
  .readFileSync(require.resolve('./schema_def.graphql'))
  .toString();

const resolvers = {
  Query: {
    reports: function report(
      source: unknown,
      args: unknown,
      context: { store: Store }
    ) {
      return context.store.listAll();
    },
    report: function report(
      source: unknown,
      args: { id: string },
      context: { store: Store }
    ) {
      return context.store.get(args.id);
    },
  },
};

const executableSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolvers,
});

export default executableSchema;
