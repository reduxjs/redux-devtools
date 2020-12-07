import { ApolloServer } from 'apollo-server-express';
import schema from '../api/schema';
import { Store } from '../store';

export default function (store: Store) {
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
}
