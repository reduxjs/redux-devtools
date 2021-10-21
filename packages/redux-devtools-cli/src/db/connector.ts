import path from 'path';
import knexModule, { Config } from 'knex';
import { SCServer } from 'socketcluster-server';

export default function connector(options: SCServer.SCServerOptions) {
  const dbOptions = options.dbOptions as Config;
  dbOptions.useNullAsDefault = true;
  if (!(dbOptions as any).migrate) {
    return knexModule(dbOptions);
  }

  dbOptions.migrations = { directory: path.resolve(__dirname, 'migrations') };
  dbOptions.seeds = { directory: path.resolve(__dirname, 'seeds') };
  const knex = knexModule(dbOptions);

  /* eslint-disable no-console */
  knex.migrate
    .latest({ loadExtensions: ['.js'] })
    .then(function () {
      return knex.seed.run({ loadExtensions: ['.js'] });
    })
    .then(function () {
      console.log('   \x1b[0;32m[Done]\x1b[0m Migrations are finished\n');
    })
    .catch(function (error) {
      console.error(error);
    });
  /* eslint-enable no-console */

  return knex;
}
