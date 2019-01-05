exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('remotedev_reports', function(table) {
      table.uuid('id').primary();
      table.string('type');
      table.string('title');
      table.string('description');
      table.string('action');
      table.text('payload', 'longtext');
      table.text('preloadedState', 'longtext');
      table.text('screenshot', 'longtext');
      table.string('userAgent');
      table.string('version');
      table.string('user');
      table.string('userId');
      table.string('instanceId');
      table.string('meta');
      table.string('exception');
      table.timestamp('added').defaultTo(knex.fn.now());
      table.uuid('appId')
        .references('id')
        .inTable('remotedev_apps').onDelete('CASCADE').onUpdate('CASCADE')
        .defaultTo('78626c31-e16b-4528-b8e5-f81301b627f4');
    }),
    knex.schema.createTable('remotedev_payloads', function(table){
      table.uuid('id').primary();
      table.text('state');
      table.text('action');
      table.timestamp('added').defaultTo(knex.fn.now());
      table.uuid('reportId')
        .references('id')
        .inTable('remotedev_reports').onDelete('CASCADE').onUpdate('CASCADE');
    }),
    knex.schema.createTable('remotedev_apps', function(table){
      table.uuid('id').primary();
      table.string('title');
      table.string('description');
      table.string('url');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('remotedev_users', function(table){
      table.uuid('id').primary();
      table.string('name');
      table.string('login');
      table.string('email');
      table.string('avatarUrl');
      table.string('profileUrl');
      table.string('oauthId');
      table.string('oauthType');
      table.string('token');
      table.timestamps(false, true);
    }),
    knex.schema.createTable('remotedev_users_apps', function(table){
      table.boolean('readOnly').defaultTo(false);
      table.uuid('userId');
      table.uuid('appId');
      table.primary(['userId', 'appId']);
      table.foreign('userId')
        .references('id').inTable('remotedev_users').onDelete('CASCADE').onUpdate('CASCADE');
      table.foreign('appId')
        .references('id').inTable('remotedev_apps').onDelete('CASCADE').onUpdate('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('remotedev_reports'),
    knex.schema.dropTable('remotedev_apps')
  ])
};
