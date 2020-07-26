export default {
    Mutation: {
        createTeam: (parent, args, { models, user }) => {
            return models.team.create({...args, owner: user.id}) 
        }
    }
};