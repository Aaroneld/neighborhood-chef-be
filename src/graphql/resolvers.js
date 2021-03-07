const { users, events, comments, commentReactions } = require('../models');
const { checkIfExists } = require('./utilities');

const resolvers = {
    Query: {
        Status: () => 'OK!',
        Users: async (obj, args, ctx) => {
            if (args.queryParams) {
                const usersList = await users.findBy(args.queryParams);
                if (usersList.length === 1) {
                    ctx.user_id = usersList[0].id;
                }

                return await usersList;
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
                throw new Error(`User id ${obj.user_id} not found`);
            }
        },
        Comments: async (obj, args) => {
            if (obj.id) {
                return comments.findAllEventComments(obj.id);
            } else {
                throw new Error(`Event id ${obj.id} not found`);
            }
        },
        EventUsers: (obj) => obj,
        status: async (obj, _, ctx) => {
            if (ctx.user_id) {
                let status = await events.findEventStatus(obj.id, ctx.user_id);

                if (status) return status.status;
                else return 'UNDECIDED';
            } else {
                throw new Error(
                    `Query Field Requested on Query with either more than 1
                    user returned or without any reference to user -- this field
                    is meant to be used with events that are related to 1 and only
                    1 user
                    `
                );
            }
        },
    },
    User: {
        UserEvents: (obj) => obj,
    },
    EventUsers: {
        attending: async (obj, args) => {
            if (obj.id) {
                return await events.findAttendingUsersForEvent(obj.id);
            } else {
                throw new Error(`Event id ${obj.id} not found`);
            }
        },
        invited: async (obj, args) => {
            if (obj.id) {
                return await events.findInvitedUsersForEvent(obj.id);
            } else {
                throw new Error(`Event id ${obj.id} not found`);
            }
        },
    },
    UserEvents: {
        owned: async (obj, args) => {
            if (obj.id) {
                return await events.findBy({ user_id: obj.id });
            } else {
                throw new Error(`User id ${obj.id} not found`);
            }
        },
        attending: async (obj, args) => {
            if (obj.id) {
                return await events.findAttendingEvents(obj.id);
            } else {
                throw new Error(`User id ${obj.id} not found`);
            }
        },
        invited: async (obj, args) => {
            if (obj.id) {
                return await events.findInvitedEvents(obj.id);
            } else {
                throw new Error(`User id ${obj.id} not found`);
            }
        },
        favorited: async (obj, args) => {
            if (obj.id) {
                const favoriteEvents = await users.findAllFavoriteEvents(
                    obj.id
                );
                return favoriteEvents.map((event) => event.id);
            } else {
                throw new Error(`User id ${obj.id} not found`);
            }
        },
        local: async (obj, args) => {
            if (args.mileRadius) {
                const localEvents = await events.findEventsWithinRadius(
                    args.mileRadius,
                    obj.latitude,
                    obj.longitude
                );
                console.log(localEvents);
                return localEvents;
            } else return [];
        },
    },
    Comment: {
        User: async (obj, args) => {
            if (obj.user_id) {
                return await users.findById(obj.user_id);
            } else {
                throw new Error(`User id ${obj.user_id} not found`);
            }
        },
        Reactions: async (obj, args) => {
            if (obj.id) {
                return await commentReactions.findAllCommentReactions(obj.id);
            } else {
                throw new Error(`Comment id ${obj.id} not found`);
            }
        },
    },
    Mutation: {
        inputUser: async (obj, args) => {
            try {
                let id = null;

                if (args.input.id) {
                    if (await checkIfExists({ id: args.input.id }, 'Users')) {
                        id = { id: args.input.id };
                        await users.update(args.input.id, args.input);
                    } else {
                        throw new Error(
                            `User with id ${args.input.id} not found`
                        );
                    }
                } else {
                    id = await users.add(args.input);
                    id = { id: id.id };
                }

                return id;
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeUser: async (obj, args) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Users')) {
                    await users.remove(args.id);
                    return { id: args.id };
                } else {
                    throw new Error(`User with id ${args.id} not found`);
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputEvent: async (obj, args) => {
            try {
                let id = null;

                if (args.input.id) {
                    if (await checkIfExists({ id: args.input.id }, 'Events')) {
                        id = { id: args.input.id };
                        await events.update(args.input.id, args.input);
                    } else {
                        throw new Error(
                            `Event with id ${args.input.id} not found`
                        );
                    }
                } else {
                    id = await events.add(args.input);
                    id = { id: id.id };
                }

                return id;
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeEvent: async (obj, args) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Events')) {
                    await events.remove(args.id);
                    return { id: args.id };
                } else {
                    throw new Error(`Event with id ${args.id} not found`);
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputEventStatus: async (obj, args) => {
            try {
                let id = null;

                if (
                    await checkIfExists(
                        {
                            event_id: args.eventStatus.event_id,
                            user_id: args.eventStatus.user_id,
                        },
                        'Events_Status'
                    )
                ) {
                    id = await events.updateInvite(args.eventStatus);
                } else {
                    id = await events.inviteUserToEvent(args.eventStatus);
                }
                id = id.id;

                return { id };
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeEventStatus: async (obj, args) => {
            try {
                if (await checkIfExists(args, 'Events_Status')) {
                    await events.removeInvite(args);
                    return args;
                } else {
                    throw new Error(
                        `EventStatus with ${JSON.stringify(args)} not found`
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputComment: async (obj, args) => {
            try {
                let id = null;

                if (args.comment.id) {
                    if (
                        await checkIfExists({ id: args.comment.id }, 'Comments')
                    ) {
                        id = await comments.update(
                            args.comment.id,
                            args.comment
                        );
                    } else {
                        throw new Error(
                            `Comment with id ${args.comment.id} not found`
                        );
                    }
                } else {
                    id = await comments.add(args.comment);
                }
                id = id.id;

                return { id };
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeComment: async (obj, args) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Comments')) {
                    await comments.remove(args.id);
                    return { id: args.id };
                } else {
                    throw new Error(`Comment with id ${args.id} not found`);
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        handleReaction: async (obj, args) => {
            const reaction = await commentReactions.findBy(args.reaction);

            if (!reaction) {
                return await commentReactions.add(args.reaction); // add a new reaction
            } else if (
                reaction &&
                args.reaction.reaction === reaction.reaction
            ) {
                return await commentReactions.remove(args.reaction); // remove reaction
            } else if (
                reaction &&
                args.reaction.reaction !== reaction.reaction
            ) {
                return await commentReactions.update(args.reaction); // update reaction
            }
        },
        favoriteEventInput: async (obj, args) => {
            try {
                if (
                    await checkIfExists(
                        {
                            event_id: args.favoriteEvent.event_id,
                            user_id: args.favoriteEvent.user_id,
                        },
                        'User_Favorite_Events'
                    )
                ) {
                    throw new Error(
                        `Event with id ${args.favoriteEvent.event_id} already favorite event`
                    );
                } else {
                    await users.addFavoriteEvent(args.favoriteEvent);
                    return { id: args.favoriteEvent.event_id };
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeFavoriteEvent: async (obj, args) => {
            try {
                if (
                    await checkIfExists(
                        {
                            event_id: args.favoriteEvent.event_id,
                            user_id: args.favoriteEvent.user_id,
                        },
                        'User_Favorite_Events'
                    )
                ) {
                    await users.removeFavoriteEvent(args.favoriteEvent);

                    return { id: args.favoriteEvent.event_id };
                } else {
                    throw new Error(
                        `Event with id ${args.favoriteEvent.event_id} not found`
                    );
                }
            } catch (err) {
                return err;
            }
        },
    },
};

module.exports = resolvers;
