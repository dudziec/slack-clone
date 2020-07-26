export default {
    Query: {
        getUser: (parent, { id }, { models }, info) => models.user.findOne({ where: { id } }),
        allUsers: (parent, args, { models }, info) => models.user.findAll(),
    }, 
    Mutation: {
        createUser: (parent, {username, email, password }, {models}) => {
            console.log(username)
            console.log(email);
            console.log(password);
            console.log(models.user)
            return models.user.create({
                username: username,
                email: email, 
                password: password,
            });
        },
    }
};