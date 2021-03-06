const { users, events, comments, commentReactions } = require('../../models');
const { checkIfExists, sendErrorRedirect, removeImage, addNewImage, updateImage } = require('../utilities');

module.exports = {
  inputUser: async (obj, args, ctx) => {
    try {
      let user = null;

      if (args.input.id) {
        let foundUser = await users.findById(args.input.id);

        if (foundUser) {
          // add new profile image to cloudinary
          if (!foundUser.photo && args.input.photo && !args.input.photo.startsWith('http')) {
            args.input.photo = await addNewImage(args.input.photo);
            // update profile image on cloudinary
          } else if (foundUser.photo && args.input.photo && !args.input.photo.startsWith('http')) {
            args.input.photo = await updateImage(foundUser.photo, args.input.photo);
          }

          if (
            // add new banner photo to cloudinary
            !foundUser.bannerPhoto &&
            args.input.bannerPhoto &&
            !args.input.bannerPhoto.startsWith('http')
          ) {
            args.input.bannerPhoto = await addNewImage(args.input.bannerPhoto);
            // update banner photo on cloudinary
          } else if (
            foundUser.bannerPhoto &&
            args.input.bannerPhoto &&
            !args.input.bannerPhoto.startsWith('http')
          ) {
            args.input.bannerPhoto = await updateImage(foundUser.bannerPhoto, args.input.bannerPhoto);
          }
          // update user's data in database
          user = await users.update(args.input.id, args.input);
        } else {
          sendErrorRedirect(
            ctx.res,
            404,
            new Error(`User with id ${args.input.id} not found`),
            'Inside GQL "inputUser" mutation'
          );
        }
      } else {
        //  add new image to cloudinary
        if (args.input.photo && !args.input.photo.startsWith('http')) {
          args.input.photo = await addNewImage(args.input.photo);
        }
        // add new user to database
        user = await users.add(args.input);
      }

      return { id: user.id, photo: user.photo };
    } catch (err) {
      console.log(err);
      return err;
    }
  },
  removeUser: async (obj, args, ctx) => {
    try {
      let foundUser = await users.findById(args.id);
      if (foundUser) {
        // remove profile image from cloudinary
        if (foundUser.photo) {
          await removeImage(foundUser.photo);
        }
        // remove banner image from cloudinary
        if (foundUser.bannerPhoto) {
          await removeImage(foundUser.bannerPhoto);
        }
        // remove user from database
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
        let foundEvent = await events.findById(args.input.id);
        if (foundEvent) {
          // update image on cloudinary
          if (foundEvent.photo && args.input.photo && !args.input.photo.startsWith('http')) {
            args.input.photo = await updateImage(foundEvent.photo, args.input.photo);
            // add new photo if foundEvent doesn't have a previously uploaded image
          } else if (!foundEvent.photo && args.input.photo && !args.input.photo.startsWith('http')) {
            args.input.photo = await addNewImage(args.input.photo);
          }
          // update event in database
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
        // upload new image to cloudinary
        console.log(args);
        if (args.input.photo && !args.input.photo.startsWith('http')) {
          args.input.photo = await addNewImage(args.input.photo);
        }
        // create new event
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
      let foundEvent = await events.findById(args.id);
      if (foundEvent) {
        // remove image from cloudinary
        if (foundEvent.photo) {
          await removeImage(foundEvent.photo);
        }
        // remove event from database
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
    try {
      let id = null;

      if (
        await checkIfExists({ id: args.comment.event_id }, 'Events') // check if event exists
      ) {
        if (args.comment.id) {
          if (
            await checkIfExists({ id: args.comment.id }, 'Comments') // check if comment exists
          ) {
            id = await comments.update(args.comment.id, args.comment);
          } else {
            sendErrorRedirect(
              ctx.res,
              404,
              new Error(`Comment with id ${args.comment.id} not found`),
              'Inside GQL "inputComment" mutation'
            );
          }
        } else {
          id = await comments.add(args.comment);
        }
      } else {
        sendErrorRedirect(
          ctx.res,
          404,
          new Error(`Event with id ${args.comment.event_id} not found`),
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
          new Error(`Event with id ${args.favoriteEvent.event_id} already favorite event`),
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
        throw new Error(`Event with id ${args.favoriteEvent.event_id} not found`);
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
