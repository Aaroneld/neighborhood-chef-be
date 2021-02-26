exports.up = function (knex) {
    return knex.schema.table('Users', (tbl) => {
        tbl.dropColumn('allergens');
        tbl.dropColumn('dietaryRestrictions');
        tbl.dropColumn('dietaryPreferences');
        tbl.dropColumn('children');
        tbl.dropColumn('pets');
    });
};

exports.down = function (knex) {
    return knex.schema;
};
