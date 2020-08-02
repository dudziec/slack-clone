import formatErrors from '../formatErrors'
import { AuthenticationError } from 'apollo-server';

export default {
    Query: {
        allTeams: (parent, args, { models, user }) => {
            if(!user) throw new AuthenticationError('You must be logged in!');
            
            return models.team.findAll({where: {owner: user.id}});
        }
    },

    Mutation: {
        createTeam: async (parent, args, { models, user }) => {
            if(!user) throw new AuthenticationError('You must be logged in!');
            try {
                const team = await models.team.create({...args, owner: user.id});
                models.channel.create({
                    name: 'general',
                    teamId: team.id,
                    public: true
                })
                return {
                    ok: true,
                    team: team,
                };
            } catch(err) {
                return {
                    ok: false,
                    errors: formatErrors(err),
                }
            }
        }
    },

    Team: {
        channels: ({ id }, args, { models }) => models.channel.findAll({where: { teamId: id}}),
    }
};