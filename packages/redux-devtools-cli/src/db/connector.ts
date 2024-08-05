import path from 'path';
import { fileURLToPath } from 'url';
import knex from 'knex';
import type { Knex } from 'knex';
import { AGServer } from 'socketcluster-server';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type KnexFunction = <TRecord extends {} = any, TResult = unknown[]>(
  config: Knex.Config | string,
) => Knex<TRecord, TResult>;

export default function connector(options: AGServer.AGServerOptions) {
  const dbOptions = options.dbOptions as Knex.Config;
  dbOptions.useNullAsDefault = true;
  if (!(dbOptions as any).migrate) {
    return (knex as unknown as KnexFunction)(dbOptions);
  }

  dbOptions.migrations = {
    directory: path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'migrations',
    ),
  };
  dbOptions.seeds = {
    directory: path.join(path.dirname(fileURLToPath(import.meta.url)), 'seeds'),
  };
  const knexInstance = (knex as unknown as KnexFunction)(dbOptions);

  /* eslint-disable no-console */
  knexInstance.migrate
    .latest({ loadExtensions: ['.js'] })
    .then(function () {
      return knexInstance.seed.run({ loadExtensions: ['.js'] });
    })
    .then(function () {
      console.log('   \x1b[0;32m[Done]\x1b[0m Migrations are finished\n');
    })
    .catch(function (error) {
      console.error(error);
    });
  /* eslint-enable no-console */

  return knexInstance;
}
