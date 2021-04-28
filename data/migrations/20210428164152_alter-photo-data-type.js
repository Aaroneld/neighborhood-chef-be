exports.up = function (knex) {
  return knex.schema
    .alterTable('Events', (t) => {
      t.string('photo').alter();
    })
    .alterTable('Users', (t) => {
      t.string('photo').alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('Events', (t) => {
      t.binary('photo').alter();
    })
    .alterTable('Users', (t) => {
      t.binary('photo').alter();
    });
};
