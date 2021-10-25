import { ApolloServer } from 'apollo-server-express';
import { schema, resolvers } from '../api/schema';
import { Store } from '../store';

export default function (store: Store) {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: {
      store: store,
    },
  });
}
