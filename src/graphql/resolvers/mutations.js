const { users, events, comments, commentReactions } = require('../../models');
const { checkIfExists, sendErrorRedirect } = require('../utilities');

module.exports = {
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
                        new Error(`User with id ${args.input.id} not found`),
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
                        new Error(`Event with id ${args.input.id} not found`),
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
                id = await events.updateStatus(args.eventStatus);
            } else {
                id = await events.addEventStatus(args.eventStatus);
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
                await events.removeStatus(args);
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
        console.log(args);
        try {
            let id = null;

            if (
                await checkIfExists({ id: args.comment.event_id }, 'Events') // check if event exists
            ) {
                if (args.comment.id) {
                    if (
                        await checkIfExists({ id: args.comment.id }, 'Comments') // check if comment exists
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
                    id = await comments.add(args.comment);
                    console.log('in here', id);
                }
            } else {
                sendErrorRedirect(
                    ctx.res,
                    404,
                    new Error(
                        `Event with id ${args.comment.event_id} not found`
                    ),
                    'Inside GQL "inputComment" mutation'
                );
            }

            id = id.id;

            return { id };
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
                    new Error(`Comment with id ${args.comment.id} not found`),
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
        } else if (reaction && args.reaction.reaction === reaction.reaction) {
            return await commentReactions.remove(args.reaction); // remove reaction
        } else if (reaction && args.reaction.reaction !== reaction.reaction) {
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
            console.log(err);
            return err;
        }
    },
    removeFavoriteEvent: async (obj, args, ctx) => {
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
    inputEventInvite: async (obj, args) => {
        try {
            if (
                await checkIfExists(
                    {
                        event_id: args.inviteInput.event_id,
                        user_id: args.inviteInput.user_id,
                        inviter_id: args.inviteInput.inviter_id,
                    },
                    'Event_Invites'
                )
            ) {
                throw new Error(
                    `User ${args.inviteInput.inviter_id} already invited ${args.inviteInput.user_id} to event ${args.inviteInput.event_id}`
                );
            } else {
                return await events.addEventInvite(args.inviteInput);
            }
        } catch (err) {
            return err;
        }
    },
    removeEventInvite: async (obj, args) => {
        try {
            if (
                await checkIfExists(
                    {
                        event_id: args.inviteInput.event_id,
                        user_id: args.inviteInput.user_id,
                        inviter_id: args.inviteInput.inviter_id,
                    },
                    'Event_Invites'
                )
            ) {
                return await events.removeEventInvite(args.inviteInput);
            } else {
                throw new Error(
                    `User ${args.inviteInput.inviter_id} inviting User ${args.inviteInput.user_id} to event ${args.inviteInput.event_id} does not exist`
                );
            }
        } catch (err) {
            return err;
        }
    },
};
