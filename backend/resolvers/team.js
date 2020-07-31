import formatErrors from '../formatErrors'
import { AuthenticationError } from 'apollo-server';

export default {
    Mutation: {
        createTeam: async (parent, args, { models, user }) => {
            if(!user) throw new AuthenticationError('You must be logged in!');
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