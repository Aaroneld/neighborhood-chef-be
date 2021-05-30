exports.up = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.string('biography', 511).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.string('biography', 255).alter();
  });
};
