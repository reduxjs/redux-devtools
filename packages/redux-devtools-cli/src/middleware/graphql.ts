import { ApolloServer } from 'apollo-server-express';
import { schema, resolvers } from '../api/schema.js';
import type { Store } from '../store.js';

export default function (store: Store) {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      store: store,
    },
  });
}
