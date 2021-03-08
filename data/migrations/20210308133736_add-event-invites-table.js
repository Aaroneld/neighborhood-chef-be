exports.up = function (knex) {
    return knex.schema.createTable('Event_Invites', (t) => {
        t.integer('event_id')
            .notNullable()
            .unsigned()
            .references('Events.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        t.integer('user_id')
            .notNullable()
            .unsigned()
            .references('Users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        t.integer('inviter_id')
            .notNullable()
            .unsigned()
            .references('Users.id')
            .onDelete('CASCADE')
            .onUpdate('CASCADE');
        t.primary(['event_id', 'user_id', 'inviter_id']);
    });
};

exports.down = function (knex) {
    knex.dropTableIfExists('Event_Invites');
};
