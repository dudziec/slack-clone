// C R U D

// Create
// Read
// Update
// Delete 

export default `
    type User {
        id: Int!,
        username: String!,
        email: String!,
        team: [Team!]!
    }

    type Query {
        me: User!,
        allUsers: [User!]!
        getUsername(id: Int!): String,
    }

    type RegisterResponse {
        ok: Boolean!,
        user: User,
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!,
        token: String,
        refreshToken: String,
        errors: [Error!]
    }

    type Mutation {
        register(username: String!, email: String!, password: String!): RegisterResponse!,
        login(email: String!, password: String!): LoginResponse!,
    }
`;
