import fs from 'fs';
import { Store } from '../store';

export const schema = fs
  .readFileSync(require.resolve('./schema_def.graphql'))
  .toString();

export const resolvers = {
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
