import type knexModule from 'knex';

export function seed(knex: knexModule) {
  return Promise.all([knex('remotedev_apps').del()]).then(function () {
    return Promise.all([
      knex('remotedev_apps').insert({
        id: '78626c31-e16b-4528-b8e5-f81301b627f4',
        title: 'Default',
      }),
    ]);
  });
}
