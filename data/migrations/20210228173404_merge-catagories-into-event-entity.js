exports.up = function (knex) {
  return knex.schema
    .table('Events', (t) => {
      t.string('category');
      t.dropColumn('category_id');
    })
    .dropTableIfExists('Categories');
};

exports.down = function (knex) {
  return knex.schema.table('Events', (t) => t.dropColumn('category'));
};
