exports.up = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.varchar('biography', 255);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.dropColumn('biography');
  });
};
