import path from 'path';
import { Knex, knex } from 'knex';
import { AGServer } from 'socketcluster-server';

export default function connector(options: AGServer.AGServerOptions) {
  const dbOptions = options.dbOptions as Knex.Config;
  dbOptions.useNullAsDefault = true;
  if (!(dbOptions as any).migrate) {
    return knex(dbOptions);
  }

  dbOptions.migrations = { directory: path.resolve(__dirname, 'migrations') };
  dbOptions.seeds = { directory: path.resolve(__dirname, 'seeds') };
  const knexInstance = knex(dbOptions);

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
