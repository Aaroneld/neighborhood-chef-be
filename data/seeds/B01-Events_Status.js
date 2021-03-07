exports.seed = function (knex) {
    return knex('Events_Status').insert([
        {
            //id: 1,
            event_id: 1,
            user_id: 2,
            status: 'NOT_GOING',
        },
        {
            //id: 2,
            event_id: 2,
            user_id: 1,
            status: 'GOING',
        },
    ]);
};
