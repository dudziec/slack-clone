import formatErrors from '../formatErrors'

export default {
    Mutation: {
        createTeam: async (parent, args, { models, user }) => {

            try {
                await models.team.create({...args, owner: user.id});
                return {
                    ok: true
                };
            } catch(err) {
                return {
                    ok: false,
                    errors: formatErrors(err),
                }
            }
        }
    }
};