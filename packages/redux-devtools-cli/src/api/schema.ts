import fs from 'fs';
import type { Store } from '../store.js';

export const schema = fs.readFileSync(
  new URL('./schema_def.graphql', import.meta.url),
  'utf8',
);

export const resolvers = {
  Query: {
    reports: function report(
      source: unknown,
      args: unknown,
      context: { store: Store },
    ) {
      return context.store.listAll();
    },
    report: function report(
      source: unknown,
      args: { id: string },
      context: { store: Store },
    ) {
      return context.store.get(args.id);
    },
  },
};
