exports.up = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.string('bannerPhoto');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('Users', (tbl) => {
    tbl.dropColumn('bannerPhoto');
  });
};
