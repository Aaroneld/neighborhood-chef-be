const db = require('../../../data/dbConfig.js');

module.exports = {
    find,
    findBy,
    findById,
    add,
    update,
    remove,
    findUsersForEvent,
    inviteUserToEvent,
    findIfUserIsAlreadyInvited,
    findUninvitedUsersForEvent,
    findInvitedEvents,
    findAttendingEvents,
    updateInvite,
    removeInvite,
    findInvitedUsersForEvent,
    findAttendingUsersForEvent,
    findEventsWithinRadius,
    findEventStatus,
};

function find() {
    return db('Events');
}

function findBy(filter) {
    return db('Events').where(filter);
}

async function add(event) {
    event.hashtags = JSON.stringify(event.hashtags);
    event.modifiers = JSON.stringify(event.modifiers);
    event.allergenWarnings = JSON.stringify(event.allergenWarnings);
    event.dietaryWarnings = JSON.stringify(event.dietaryWarnings);

    const [id] = await db('Events').insert(event).returning('id');

    return findById(id);
}

function findById(id) {
    return db('Events').where('id', id).first();
}

function update(id, changes) {
    changes.hashtags = JSON.stringify(changes.hashtags);
    changes.modifiers = JSON.stringify(changes.modifiers);
    changes.allergenWarnings = JSON.stringify(changes.allergenWarnings);
    changes.dietaryWarnings = JSON.stringify(changes.dietaryWarnings);

    return db('Events')
        .where({ id })
        .update(changes)
        .returning('id')
        .then((count) => (count > 0 ? this.findById(id) : null));
}

function remove(id) {
    return db('Events').where({ id }).del();
}

async function findUninvitedUsersForEvent(id) {
    const allUsers = await db('Users');

    const invitedUsers = await db('Users')
        .select('*')
        .join('Events_Status', 'Events_Status.user_id', 'Users.id')
        .where('Events_Status.event_id', id);

    const seen = {};
    invitedUsers.forEach((user) => (seen[user.id] = user));

    return allUsers.filter((user) => !(user.id in seen));
}

function findUsersForEvent(id) {
    return db('Events')
        .select('Users.*', 'Events_Status.status')
        .join('Events_Status', 'Events_Status.event_id', 'Events.id')
        .join('Users', 'Users.id', 'Events_Status.user_id')
        .where('Events.id', id);
}

function findInvitedUsersForEvent(id) {
    return db('Events')
        .select('Users.*', 'Events_Status.status')
        .join('Events_Status', 'Events_Status.event_id', 'Events.id')
        .join('Users', 'Users.id', 'Events_Status.user_id')
        .where((builder) => {
            builder.where({ 'Events.id': id });
        })
        .andWhere(function () {
            this.whereIn('Events_Status.status', ['MAYBE_GOING', 'NOT_GOING']);
        });
}

function findAttendingUsersForEvent(id) {
    return db('Events')
        .select('Users.*', 'Events_Status.status')
        .join('Events_Status', 'Events_Status.event_id', 'Events.id')
        .join('Users', 'Users.id', 'Events_Status.user_id')
        .where((builder) => {
            builder.where({ 'Events.id': id });
        })
        .andWhere(function () {
            this.whereIn('Events_Status.status', ['GOING']);
        });
}

function findIfUserIsAlreadyInvited(invite) {
    return db('Events_Status')
        .where('Events_Status.user_id', invite.user_id)
        .andWhere('Events_Status.event_id', invite.event_id)
        .first();
}

async function inviteUserToEvent(invite) {
    const invitation = await db('Events_Status').insert(invite);

    return findById(invite.event_id);
}

async function updateInvite(invite) {
    const updated = await db('Events_Status')
        .where('Events_Status.event_id', invite.event_id)
        .andWhere('Events_Status.user_id', invite.user_id)
        .update(invite);

    return db('Events').where('id', invite.event_id).first();
}

function removeInvite(invite) {
    return db('Events_Status')
        .where('Events_Status.event_id', invite.event_id)
        .andWhere('Events_Status.user_id', invite.user_id)
        .del();
}

function findInvitedEvents(id) {
    return db('Events')
        .select('Events.*')
        .join('Events_Status', 'Events_Status.event_id', 'Events.id')
        .whereNot('Events.user_id', id)
        .where('Events_Status.user_id', id)
        .whereIn('Events_Status.status', ['MAYBE_GOING', 'NOT_GOING']);
}

function findAttendingEvents(id) {
    return db('Events')
        .select('Events.*')
        .join('Events_Status', 'Events_Status.event_id', 'Events.id')
        .whereNot('Events.user_id', id)
        .where('Events_Status.user_id', id)
        .andWhere('Events_Status.status', 'GOING');
}

function findEventStatus(event_id, user_id) {
    return db('Events_Status')
        .select('status')
        .where({ event_id, user_id })
        .first();
}

function findEventsWithinRadius(radius, latitude, longitude) {
    distanceFromCenter = radius * 0.326333;
    //y=-0.0001214x^{2}-0.001881x+1.153

    return db('Events')
        .select('*')
        .whereBetween('latitude', [
            Number(latitude) - distanceFromCenter,
            Number(latitude) + distanceFromCenter,
        ])
        .andWhereBetween('longitude', [
            Number(longitude) - distanceFromCenter,
            Number(longitude) + distanceFromCenter,
        ]);
}
