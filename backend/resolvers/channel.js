import formatErrors from "../formatErrors";
import team from "./team";

export default {
    Mutation: {
        createChannel: (parent, args, { models, user }) => {
            if (!user) throw new AuthenticationError("You must be logged in!");
            try {
                models.team.findOne({where: {id: args.teamId}});

                if(team.owner !== user.id) {
                    return {
                        ok: false,
                        errors: [
                            {
                                path: 'name',
                                message: 'You have to be owner to create channels',
                            }
                        ]
                    }
                }

                const channel = models.channel.create(args);
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