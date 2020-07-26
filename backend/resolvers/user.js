import bcrypt from 'bcrypt'

export default {
    Query: {
        getUser: (parent, { id }, { models }, info) => models.user.findOne({ where: { id } }),
        allUsers: (parent, args, { models }, info) => models.user.findAll(),
    }, 
    Mutation: {
        register: async (parent, {username, email, password }, {models}) => {
            try {
                const hashedPassword = await bcrypt.hash(password, 12);
                await models.user.create({
                    username: username,
                    email: email, 
                    password: hashedPassword,
                });

                return true 
                
            } catch(err) {
                console.log(err);
                return false;
            }
            return 
        },
    }
};