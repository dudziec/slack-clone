export default `
type DirectMessage {
    id: Int!,
    text: String!
    sender: User!,
    receiverId: Int!,
    createdAt: String
}

type Query {
    allDirectMessages(teamId: Int!, interlocutorId: Int!): [DirectMessage!]
}

type Subscription {
    newDirectMessage(teamId: Int!, userId: Int!): DirectMessage!
}

type Mutation {
    createDirectMessage(receiverId: Int!, text: String!, teamId: Int!): Boolean!,
}
`;
