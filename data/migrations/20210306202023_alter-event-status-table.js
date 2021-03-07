exports.up = function (knex) {
    return knex.schema.alterTable('Events_Status', (t) => {
        t.dropColumn('inviter_id');
        t.dropColumn('status');
    });
};

exports.down = function (knex) {
    return knex.schema.alterTable('Events_Status', (t) => {
        t.integer('inviter_id')
            .notNullable()
            .unsigned()
            .references('Users.id')
            .onUpdate('CASCADE');
        t.enum('status', [
            'Not Approved',
            'Approved',
            'Not Going',
            'Maybe Going',
            'Going',
        ])
            .notNullable()
            .defaultTo('Not Approved')
            .alter();
    });
};
