import { withFilter } from "apollo-server";
import pubsub from "../pubsub";

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

export default {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        (parent, { channelId }, { models, user }) => {
          if (!user) throw new AuthenticationError("You must be logged in!");

          return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE);
        },
        (payload, { channelId }) => {
          return payload.channelId === channelId;
        }
      ),
    },
  },

  Query: {
    allMessages: async (_, { channelId }, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      return models.message.findAll(
        {
          include: {
            model: models.user,
          },
          where: {
            channel_id: channelId,
          },
          order: [["createdAt", "ASC"]],
        },
        { raw: true }
      );
    },
  },

  Mutation: {
    createMessage: async (_, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        const message = await models.message.create({
          ...args,
          userId: user.id,
        });

        const foundUser = models.user.findOne({ where: { id: user.id } });

        pubsub.publish(NEW_CHANNEL_MESSAGE, {
          channelId: message.channelId,
          newChannelMessage: {
            ...message.dataValues,
            user: {
              id: 1,
              username: foundUser.username,
            },
          },
        });

        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
