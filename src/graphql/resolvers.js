const { users, events, comments, commentReactions } = require('../models');
const { checkIfExists, sendErrorRedirect } = require('./utilities');

const resolvers = {
    Query: {
        Status: () => 'OK!',
        Users: async (_, args, ctx) => {
            try {
                if (args.queryParams) {
                    return await users.findBy(args.queryParams);
                }
                return await users.find();
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
                return comments.findAllEventComments(obj.id);
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
        favorited: async (obj) => await users.findAllFavoriteEvents(obj.id),
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
    },

    Mutation: {
        inputUser: async (obj, args, ctx) => {
            try {
                let id = null;

                if (args.input.id) {
                    if (await checkIfExists({ id: args.input.id }, 'Users')) {
                        id = { id: args.input.id };
                        await users.update(args.input.id, args.input);
                    } else {
                        sendErrorRedirect(
                            ctx.res,
                            404,
                            new Error(
                                `User with id ${args.input.id} not found`
                            ),
                            'Inside GQL "inputUser" mutation'
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
        removeUser: async (obj, args, ctx) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Users')) {
                    await users.remove(args.id);
                    return { id: args.id };
                } else {
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(`User with id ${args.id} not found`),
                        'Inside GQL "removetUser" mutation'
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputEvent: async (obj, args, ctx) => {
            try {
                let id = null;

                if (args.input.id) {
                    if (await checkIfExists({ id: args.input.id }, 'Events')) {
                        id = { id: args.input.id };
                        await events.update(args.input.id, args.input);
                    } else {
                        sendErrorRedirect(
                            ctx.res,
                            404,
                            new Error(
                                `Event with id ${args.input.id} not found`
                            ),
                            'Inside GQL "inputEvent" mutation'
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
        removeEvent: async (obj, args, ctx) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Events')) {
                    await events.remove(args.id);
                    return { id: args.id };
                } else {
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(`Event with id ${args.id} not found`),
                        'Inside GQL "removeEvent" mutation'
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputEventStatus: async (obj, args, ctx) => {
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
        removeEventStatus: async (obj, args, ctx) => {
            try {
                if (await checkIfExists(args, 'Events_Status')) {
                    await events.removeInvite(args);
                    return args;
                } else {
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(`EventStatus with ${args} not found`),
                        'Inside GQL "removeEventStatus" mutation'
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        inputComment: async (obj, args, ctx) => {
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
                            sendErrorRedirect(
                                ctx.res,
                                404,
                                new Error(
                                    `Comment with id ${args.comment.id} not found`
                                ),
                                'Inside GQL "inputComment" mutation'
                            );
                        }
                    } else {
                        id = await comments.add(args.comment); // else add new comment
                    }
                    id = id.id;

                    return { id };
                } else {
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(
                            `Comment with id ${args.comment.id} not found`
                        ),
                        'Inside GQL "inputComment" mutation'
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        removeComment: async (obj, args, ctx) => {
            try {
                if (await checkIfExists({ id: args.id }, 'Comments')) {
                    await comments.remove(args.id);
                    return { id: args.id };
                } else {
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(
                            `Comment with id ${args.comment.id} not found`
                        ),
                        'Inside GQL "removeComment" mutation'
                    );
                }
            } catch (err) {
                console.log(err);
                return err;
            }
        },
        handleReaction: async (obj, args, ctx) => {
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
        favoriteEventInput: async (obj, args, ctx) => {
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
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(
                            `Event with id ${args.favoriteEvent.event_id} already favorite event`
                        ),
                        'Inside GQL "FavoriteEventInput" mutation'
                    );
                } else {
                    await users.addFavoriteEvent(args.favoriteEvent);
                    return { id: args.favoriteEvent.event_id };
                }
            } catch (err) {
                return err;
            }
        },
        removeFavoriteEvent: async (obj, args, ctx) => {
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
                    sendErrorRedirect(
                        ctx.res,
                        404,
                        new Error(`Event with id ${args.event} not found`),
                        'Inside GQL "FavoriteEventInput" mutation'
                    );
                }
            } catch (err) {
                return err;
            }
        },
    },
};

module.exports = resolvers;
