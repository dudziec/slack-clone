export default {
    Mutation: {
        createChannel: (parent, args, { models }) => models.channel.create(args),
    }
};