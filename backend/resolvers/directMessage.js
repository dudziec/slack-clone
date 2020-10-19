import { Op } from "sequelize";
import { withFilter } from "apollo-server";
import pubsub from "../pubsub";

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE";

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: withFilter(
        (parent, args, { user }) => {
          if (!user) throw new AuthenticationError("You must be logged in!");

          return pubsub.asyncIterator(NEW_DIRECT_MESSAGE);
        },
        (payload, args, { user }) => {
          return (
            payload.teamId === args.teamId &&
            ((payload.senderId === user.user.id &&
              payload.receiverId === args.userId) ||
              (payload.senderId === args.userId &&
                payload.receiverId === user.user.id))
          );
        }
      ),
    },
  },
  DirectMessage: {
    sender: async ({ senderId, sender }, args, { models }) => {
      if (sender) {
        return sender;
      }

      return models.user.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
  Query: {
    allDirectMessages: async (
      _,
      { teamId, interlocutorId },
      { models, user }
    ) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        const result = await models.direct_message.findAll(
          {
            include: {
              model: models.user,
            },
            where: {
              teamId,
              [Op.or]: [
                {
                  [Op.and]: [
                    { receiverId: interlocutorId },
                    { senderId: user.id },
                  ],
                },
                {
                  [Op.and]: [
                    { receiverId: user.id },
                    { senderId: interlocutorId },
                  ],
                },
              ],
            },
            order: [["createdAt", "ASC"]],
          },
          { raw: true }
        );
        console.log(result);

        return result;
      } catch (err) {
        console.log(err);
      }
    },
  },

  Mutation: {
    createDirectMessage: async (_, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        const directMessage = await models.direct_message.create({
          ...args,
          senderId: user.id,
        });

        pubsub.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: user.username,
            },
          },
        });

        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
