const db = require('../../../data/dbConfig.js');

module.exports = {
    find,
    findBy,
    findById,
    add,
    update,
    remove,
    findIfAlreadyFavorite,
    addFavoriteEvent,
    removeFavoriteEvent,
    findAllFavoriteEvents,
};

function find() {
    return db('Users');
}

async function findBy(filter) {
    if (
        JSON.stringify(Object.keys(filter).sort()) ===
        JSON.stringify(['latitude', 'longitude', 'radius'].sort())
    ) {
        return await findUsersWithinRadius(
            filter.radius,
            filter.latitude,
            filter.longitude
        );
    } else {
        return db('Users').where(filter);
    }
}

async function add(user) {
    const [id] = await db('Users').insert(user).returning('id');

    return findById(id);
}

function findById(id) {
    return db('Users').where('id', id).first();
}

function update(id, changes) {
    return db('Users')
        .where({ id })
        .update(changes)
        .returning('id')
        .then((count) => (count > 0 ? this.findById(id) : null));
}

function remove(id) {
    return db('Users').where({ id }).del();
}

function findIfAlreadyFavorite(favorite) {
    return db('User_Favorite_Events')
        .where('User_Favorite_Events.user_id', favorite.user_id)
        .andWhere('User_Favorite_Events.event_id', favorite.event_id)
        .first();
}

async function addFavoriteEvent(favoriteEvent) {
    await db('User_Favorite_Events').insert(favoriteEvent);

    return findIfAlreadyFavorite(favoriteEvent);
}

function removeFavoriteEvent(favoriteEvent) {
    return db('User_Favorite_Events')
        .where('User_Favorite_Events.event_id', favoriteEvent.event_id)
        .andWhere('User_Favorite_Events.user_id', favoriteEvent.user_id)
        .del();
}

function findAllFavoriteEvents(id) {
    return db('Events')
        .join(
            'User_Favorite_Events',
            'User_Favorite_Events.event_id',
            'Events.id'
        )
        .where('User_Favorite_Events.user_id', id);
}

function longitudeMinuteInMilesAtLatitude(latitude) {
    return (
        (6557 / 54000000) * latitude ** 2 -
        (10159 / 5400000) * latitude +
        17293 / 15000
    );
}

function oneMileInTermsOfMinutes(MinuteInMiles) {
    const mileAsPercentOfMinute = 1 / MinuteInMiles;
    return (1 / 60) * mileAsPercentOfMinute;
}

function findUsersWithinRadius(radius, latitude, longitude) {
    const longitudeMinuteInMiles = longitudeMinuteInMilesAtLatitude(
        Math.abs(latitude)
    );
    const longitudeMinuteMile = oneMileInTermsOfMinutes(longitudeMinuteInMiles);
    const latitudeMinuteMile = oneMileInTermsOfMinutes(69 / 60);
    const latitudeRadius = latitudeMinuteMile * radius;
    const longitudeRadius = longitudeMinuteMile * radius;

    return db('Users')
        .select('*')
        .whereBetween('latitude', [
            Number(latitude) - latitudeRadius,
            Number(latitude) + latitudeRadius,
        ])
        .andWhereBetween('longitude', [
            Number(longitude) - longitudeRadius,
            Number(longitude) + longitudeRadius,
        ]);
}
