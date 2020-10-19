import formatErrors from "../formatErrors";
import { AuthenticationError } from "apollo-server";

export default {
  Query: {
    getTeamMembers: async (parent, { id }, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      return models.sequelize.query(
        "select * from users join members m on id = m.user_id where m.team_id = ?",
        {
          replacements: [id],
          model: models.user,
          raw: true,
        }
      );
    },
  },

  Mutation: {
    addTeamMember: async (parent, { email, teamId }, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      try {
        const teamPromise = models.member.findOne(
          { where: { teamId, userId: user.id } },
          { raw: true }
        );
        const userToAddPromise = models.user.findOne({ where: { email } });

        const [team, userToAdd] = await Promise.all([
          teamPromise,
          userToAddPromise,
        ]);

        if (team.admin === false) {
          return {
            ok: false,
            errors: [
              { path: "email", message: "You cannot add members to the team" },
            ],
          };
        }

        if (!userToAdd) {
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
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err),
        };
      }
    },
    createTeam: async (parent, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");
      try {
        const response = await models.sequelize.transaction(async () => {
          const team = await models.team.create({ ...args });
          await models.member.create({
            teamId: team.id,
            userId: user.id,
            admin: true,
          });
          await models.channel.create({
            name: "general",
            teamId: team.id,
            public: true,
          });

          return team;
        });
        return {
          ok: true,
          team: response,
        };
      } catch (err) {
        console.log(err);
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
    directMessageMembers: ({ id }, args, { models, user }) =>
      models.sequelize.query(
        "select distinct u.username, u.id from users u join direct_messages dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId",
        {
          replacements: { currentUserId: user.id, teamId: id },
          model: models.user,
          raw: true,
        }
      ),
  },
};
