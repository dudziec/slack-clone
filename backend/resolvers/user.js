import bcrypt from 'bcrypt'
import _ from 'lodash'

const formatErrors = (e, models) => {
    if (e.name === 'SequelizeValidationError') {
      return e.errors.map(x => _.pick(x, ['path', 'message']));
    }
    return [{ path: 'name', message: 'something went wrong' }];
  };

export default {
    Query: {
        getUser: (parent, { id }, { models }) => models.user.findOne({ where: { id } }),
        allUsers: (parent, args, { models }) => models.user.findAll(),
    }, 
    Mutation: {
        register: async (parent, {username, email, password }, {models}) => {
            try { 
                const hashedPassword = await bcrypt.hash(password, 12);
                const createdUser = await models.user.create({
                    username: username,
                    email: email, 
                    password: hashedPassword,
                });

                return {
                    ok: true,
                    user: createdUser,
                } 
                
            } catch(err) {
                console.log(err);
                return {
                    ok: false,
                    errors: formatErrors(err, models),
                }
            }
            return 
        },
    }
};