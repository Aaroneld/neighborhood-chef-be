exports.up = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.string('bio', 511);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.string('bio', 255);
  });
};
