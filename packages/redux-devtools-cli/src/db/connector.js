var path = require('path');
var knexModule = require('knex');

module.exports = function connector(options) {
  var dbOptions = options.dbOptions;
  dbOptions.useNullAsDefault = true;
  if (!dbOptions.migrate) {
    return knexModule(dbOptions);
  }

  dbOptions.migrations = { directory: path.resolve(__dirname, 'migrations') };
  dbOptions.seeds = { directory: path.resolve(__dirname, 'seeds') };
  var knex = knexModule(dbOptions);

  knex.migrate.latest()
    .then(function() {
      return knex.seed.run();
    })
    .then(function() {
      console.log('   \x1b[0;32m[Done]\x1b[0m Migrations are finished\n');
    })
    .catch(function(error) {
      console.error(error);
    });

  return knex;
};
