const { users, events, comments, commentReactions } = require('../../models');
const { sendErrorRedirect } = require('../utilities');

module.exports = {
    Query: {
        Status: () => 'OK!',
        Users: async (_, args, ctx) => {
            try {
                if (args.queryParams) {
                    const usersList = await users.findBy(args.queryParams);
                    if (usersList.length === 1) {
                        ctx.user_id = usersList[0].id;
                    }

                    return await usersList;
                } else {
                    return await users.find();
                }
            } catch (err) {
                sendErrorRedirect(
                    ctx.res,
                    500,
                    err,
                    "Inside GQL 'Users' query"
                );
            }
        },
        Events: async (_, args, ctx) => {
            try {
                if (args.queryParams) {
                    return await events.findBy(args.queryParams);
                }
                return await events.find();
            } catch (err) {
                sendErrorRedirect(
                    ctx.res,
                    500,
                    err,
                    "Inside GQL 'Events' query"
                );
            }
        },
    },
    Event: {
        User: async (obj, args, ctx) => {
            if (obj.user_id) {
                return await users.findById(obj.user_id);
            } else {
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`User id is required`),
                    'Inside GQL Event->User subquery'
                );
            }
        },
        Comments: async (obj, args, ctx) => {
            if (obj.id) {
                const allEventComments = await comments.findAllEventComments(
                    obj.id
                );
                return allEventComments.filter((event) => event.root_id === 0);
            } else {
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`Event id is required`),
                    'Inside GQL Event->Comments subquery'
                );
            }
        },
        EventUsers: (obj, args, ctx) => {
            if (obj.id) return obj;
            else
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`Event id is required`),
                    'Inside GQL Event->EventUsers subquery'
                );
        },
        status: async (obj, _, ctx) => {
            if (ctx.user_id) {
                let status = await events.findEventStatus(obj.id, ctx.user_id);

                if (status) return status.status;
                else return 'UNDECIDED';
            } else {
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`
                    status' Query Field Requested on 'Event' Query
                    with either more than 1 user in graph or without
                    any reference to user -- this field is meant to be
                    used with events that are related to 1 and only
                    1 user`),
                    'Inside GQL Event->EventUsers->status subquery'
                );
            }
        },
    },
    User: {
        UserEvents: (obj, args, ctx) => {
            if (obj.id) return obj;
            else
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`User id is required`),
                    'Inside GQL Event->UserEvents subquery'
                );
        },
    },
    EventUsers: {
        attending: async (obj) =>
            await events.findAttendingUsersForEvent(obj.id),
        invited: async (obj) => await events.findInvitedUsersForEvent(obj.id),
    },
    UserEvents: {
        owned: async (obj) => await events.findBy({ user_id: obj.id }),
        attending: async (obj) => await events.findAttendingEvents(obj.id),
        invited: async (obj) => await events.findInvitedEvents(obj.id),
        favorited: async (obj) => {
            const favoriteEvents = await users.findAllFavoriteEvents(obj.id);
            return favoriteEvents.map((event) => event.id);
        },
        local: async (obj, args) => {
            if (args.mileRadius) {
                const localEvents = await events.findEventsWithinRadius(
                    args.mileRadius,
                    obj.latitude,
                    obj.longitude
                );
                return localEvents;
            } else return [];
        },
    },
    Comment: {
        User: async (obj, args, ctx) => {
            if (obj.user_id) {
                return await users.findById(obj.user_id);
            } else {
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`User id is required`),
                    'Inside GQL Event->Comments->Comment subquery'
                );
            }
        },
        Reactions: async (obj, args, ctx) => {
            if (obj.id) {
                return await commentReactions.findAllCommentReactions(obj.id);
            } else {
                sendErrorRedirect(
                    ctx.res,
                    400,
                    new Error(`Comment id is required`),
                    'Inside GQL Event->Comments->Comment->Reactions subquery'
                );
            }
        },
        Subcomments: async (obj, args) => {
            if (obj.id) {
                return await comments.findBy({ root_id: obj.id });
            } else {
                return [];
            }
        },
        Parent: async (obj, args) => {
            if (obj.parent_id) {
                return await users.findById(obj.parent_id);
            } else return null;
        },
    },
};
