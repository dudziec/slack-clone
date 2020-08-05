import formatErrors from "../formatErrors";
import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    allTeams: (parent, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      return models.team.findAll({ where: { owner: user.id } });
    },
  },

  Mutation: {
    addTeamMember: async (parent, { email, teamId }, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      try {
        const teamPromise = models.team.findOne({ where: { id: teamId } });
        const userToAddPromise = models.user.findOne({ where: { email } });

        const [team, userToAdd] = await Promise.all([
          teamPromise,
          userToAddPromise,
        ]);

        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [
              { path: "email", message: "You cannot add members to the team" },
            ],
          };
        }

        if(!userToAdd) {
            return {
                ok: false,
                errors: [
                  { path: "email", message: "Could not find user with this email" },
                ],
              };
        }
        
        await models.member.create({ userId: userToAdd.id, teamId });

        return {
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    createTeam: async (parent, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        const team = await models.team.create({ ...args, owner: user.id });
        models.channel.create({
          name: "general",
          teamId: team.id,
          public: true,
        });
        return {
          ok: true,
          team: team,
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
  },

  Team: {
    channels: ({ id }, args, { models }) =>
      models.channel.findAll({ where: { teamId: id } }),
  },
};
