const { users, events, comments, commentReactions } = require('../models');
const { checkIfExists } = require('./utilities');

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
        UserEvents: (obj) => obj,
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

                if (
                    await checkIfExists({ id: args.comment.event_id }, 'Events') // check if event exists
                ) {
                    if (args.comment.id) {
                        if (
                            await checkIfExists(
                                { id: args.comment.id },
                                'Comments'
                            ) // check if comment exists
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
                        id = await comments.add(args.comment); // else add new comment
                    }
                    id = id.id;
                    return { id };
                } else {
                    throw new Error(
                        `Event with id ${args.comment.event_id} not found`
                    );
                }
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
            }
            if (reaction && args.reaction.reaction === reaction.reaction) {
                return await commentReactions.remove(args.reaction); // remove reaction
            }
            if (reaction && args.reaction.reaction !== reaction.reaction) {
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
                return err;
            }
        },
        removeFavoriteEvent: async (obj, args) => {
            try {
                if (
                    await checkIfExists(
                        {
                            event_id: args.event,
                            user_id: args.user,
                        },
                        'User_Favorite_Events'
                    )
                ) {
                    await users.removeFavoriteEvent(args.event, args.user);
                    return { id: args.event };
                } else {
                    throw new Error(`Event with id ${args.id} not found`);
                }
            } catch (err) {
                return err;
            }
        },
    },
};

module.exports = resolvers;
