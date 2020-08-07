export default `
    type Message {
        id: Int!,
        text: String!
        user: User!,
        channel: Channel!,
        createdAt: String
    }
    
    type Query {
        allMessages(channelId: Int!): [Message!]
    }

    type Mutation {
        createMessage(channelId: Int!, text: String!): Boolean!,
    }
`;
