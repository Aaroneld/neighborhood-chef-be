exports.up = function (knex) {
    return knex.schema.alterTable('Events_Status', (t) => {
        t.enum('status', ['NOT_GOING', 'MAYBE_GOING', 'GOING'])
            .notNullable()
            .defaultTo('NOT_GOING');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Events_Status', (t) => {
        t.dropColumn('status');
    });
};
