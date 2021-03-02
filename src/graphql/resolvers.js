const { users, events, comments, commentReactions } = require('../models');

const resolvers = {
    Query: {
        Status: () => 'OK!',
        Users: async (obj, args) => {
            if (args.queryParams) {
                return await users.findBy(args.queryParams);
            }
            return await users.find();
        },
        Events: async (obj, args) => {
            if (args.queryParams) {
                return await events.findBy(args.queryParams);
            }
            return await events.find();
        },
    },
    Event: {
        User: async (obj, args) => {
            if (obj.user_id) {
                return await users.findById(obj.user_id);
            } else {
                throw new Error('User id required!');
            }
        },
        Comments: async (obj, args) => {
            if (obj.id) {
                return comments.findAllEventComments(obj.id);
            } else {
                throw new Error('Event id required!');
            }
        },
        EventUsers: (obj) => obj,
    },
    User: {
        UserEvents: async (obj, args) => {
            return obj;
        },
    },
    EventUsers: {
        attending: async (obj, args) => {
            if (obj.id) {
                return await events.findAttendingUsersForEvent(obj.id);
            } else {
                throw new Error('No event id given');
            }
        },
        invited: async (obj, args) => {
            if (obj.id) {
                await events.findInvitedUsersForEvent(obj.id);
            } else {
                throw new Error('No event id given');
            }
        },
    },
    UserEvents: {
        owned: async (obj, args) => {
            if (obj.id) {
                return await events.findBy({ user_id: obj.id });
            } else {
                throw new Error('No user id given');
            }
        },
        attending: async (obj, args) => {
            if (obj.id) {
                return await events.findAttendingEvents(obj.id);
            } else {
                throw new Error('No user id given');
            }
        },
        invited: async (obj, args) => {
            if (obj.id) {
                return await events.findInvitedEvents(obj.id);
            } else {
                throw new Error('No user id given');
            }
        },
        favorited: async (obj, args) => {
            if (obj.id) {
                return await users.findAllFavoriteEvents(obj.id);
            } else {
                throw new Error('No user id given');
            }
        },
    },
    Comment: {
        User: async (obj, args) => {
            if (obj.user_id) {
                return await users.findById(obj.user_id);
            } else {
                throw new Error('No user id given');
            }
        },
        Reactions: async (obj, args) => {
            if (obj.id) {
                return await commentReactions.findAllCommentReactions(obj.id);
            } else {
                throw new Error('No comment id given');
            }
        },
    },
};

module.exports = resolvers;
