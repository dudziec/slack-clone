import formatErrors from "../formatErrors";

export default {
    Mutation: {
        createChannel: (parent, args, { models }) => {
            try {
                const channel = models.channel.create(args)

                return {
                    ok: true,
                    channel: channel
                }
            } catch(err) {
                return {
                    ok: false,
                    errors: formatErrors(err),
                }
            }
        },
    }
};