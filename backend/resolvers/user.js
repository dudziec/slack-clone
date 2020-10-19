import _ from "lodash";
import { tryLogin } from "../auth";
import formatErrors from "../formatErrors";
import { AuthenticationError } from "apollo-server";

export default {
  User: {
    team: (parent, args, { models, user }) => {
      return models.sequelize.query(
        "select * from teams join members on teams.id = members.team_id where user_id = ?",
        {
          replacements: [user.id],
          model: models.team,
          raw: true,
        }
      );
    },
  },
  Query: {
    me: (parent, args, { models, user }) => {
      if (!user) throw new AuthenticationError("You must be logged in!");

      return models.user.findOne({ where: { id: user.id } });
    },

    getUsername: async (parent, { id }, { models, user }) => {
        if(!user) throw new AuthenticationError("You must be logged in!");
        const u = await models.user.findOne({where: id});
        return u.username;
    },
    allUsers: (parent, args, { models }) => models.user.findAll(),
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    register: async (_, args, { models }) => {
      try {
        const createdUser = await models.user.create(args);

        return {
          ok: true,
          user: createdUser,
        };
      } catch (err) {
        console.log(err);
        return {
          ok: false,
          errors: formatErrors(err, models),
        };
      }
      return;
    },
  },
};
