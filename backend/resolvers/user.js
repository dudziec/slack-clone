import bcrypt from 'bcrypt'
import _ from 'lodash'
import { tryLogin } from '../auth' 

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
        login: (parent, {email, password}, {models, SECRET, SECRET2 }) => tryLogin(email, password, models, SECRET, SECRET2),
        register: async (parent, args, {models}) => {
            try { 
                const createdUser = await models.user.create(args);

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