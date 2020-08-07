export default {
  Query: {
    allMessages: async (parent, { channelId }, { models, user }) => {
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
    createMessage: async (parent, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        await models.message.create({
          ...args,
          userId: user.id,
        });
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    },
  },
};
