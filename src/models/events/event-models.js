const db = require('../../../data/dbConfig.js');

module.exports = {
  find,
  findBy,
  findById,
  add,
  update,
  remove,
  addEventStatus,
  findInvitedEvents,
  findAttendingEvents,
  updateStatus,
  removeStatus,
  findInvitedUsersForEvent,
  findAttendingUsersForEvent,
  findEventsWithinRadius,
  findEventStatus,
  addEventInvite,
  removeEventInvite,
  findUsersYouInvitedToParticularEvent,
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

function findInvitedUsersForEvent(id) {
  return db('Event_Invites as ei')
    .select('u.*')
    .join('Users as u', 'ei.user_id', 'u.id')
    .where({ 'ei.event_id': id });
}

function findMaybeGoingUsersForEvent(id) {
  return db('Events')
    .select('Users.*', 'Events_Status.status')
    .join('Events_Status', 'Events_Status.event_id', 'Events.id')
    .join('Users', 'Users.id', 'Events_Status.user_id')
    .where((builder) => {
      builder.where({ 'Events.id': id });
    })
    .andWhere(function () {
      this.whereIn('Events_Status.status', ['MAYBE']);
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

async function addEventStatus(status) {
  await db('Events_Status').insert(status);

  return findById(status.event_id);
}

async function updateStatus(status) {
  await db('Events_Status').where({ event_id: status.event_id, user_id: status.user_id }).update(status);

  return await db('Events').where('id', status.event_id).first();
}

function removeStatus(status) {
  return db('Events_Status').where({ event_id: status.event_id, user_id: status.user_id }).del();
}

function findInvitedEvents(id) {
  return db('Events as e')
    .distinctOn('e.id')
    .select('e.*')
    .join('Event_Invites as ei', 'ei.event_id', 'e.id')
    .whereNot('e.user_id', id)
    .where('ei.user_id', id);
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
  return db('Events_Status').select('status').where({ event_id, user_id }).first();
}

function longitudeMinuteInMilesAtLatitude(latitude) {
  return (6557 / 54000000) * latitude ** 2 - (10159 / 5400000) * latitude + 17293 / 15000;
}

function oneMileInTermsOfMinutes(MinuteInMiles) {
  const mileAsPercentOfMinute = 1 / MinuteInMiles;
  return (1 / 60) * mileAsPercentOfMinute;
}

function findEventsWithinRadius(radius, latitude, longitude) {
  const longitudeMinuteInMiles = longitudeMinuteInMilesAtLatitude(Math.abs(latitude));
  const longitudeMinuteMile = oneMileInTermsOfMinutes(longitudeMinuteInMiles);
  const latitudeMinuteMile = oneMileInTermsOfMinutes(69 / 60);
  const latitudeRadius = latitudeMinuteMile * radius;
  const longitudeRadius = longitudeMinuteMile * radius;

  return db('Events')
    .select('*')
    .whereBetween('latitude', [Number(latitude) - latitudeRadius, Number(latitude) + latitudeRadius])
    .andWhereBetween('longitude', [Number(longitude) - longitudeRadius, Number(longitude) + longitudeRadius]);
}

async function addEventInvite(invite) {
  await db('Event_Invites').insert(invite);
  return true;
}

async function removeEventInvite(invite) {
  await db('Event_Invites').where(invite).del();
  return true;
}

function findUsersYouInvitedToParticularEvent(event_id, inviter_id) {
  return db('Users as u')
    .select('u.*')
    .join('Event_Invites as ei', 'ei.user_id', 'u.id')
    .where({ event_id, inviter_id });
}
