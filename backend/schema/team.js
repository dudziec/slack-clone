export default `
    type Team {
        id: Int!,
        name: String!,
        directMessageMembers: [User!]!,
        channels: [Channel!]!
        admin: Boolean
    }

    type Query {
        allTeams: [Team!]!
        inviteTeams: [Team!]
        getTeamMembers(id: Int!): [User!]!
    }

    type CreateTeamResponse {
        ok: Boolean!,
        team: Team,
        errors: [Error!],
    }

    type VoidResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse
    }
`;
