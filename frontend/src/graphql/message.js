import { gql } from '@apollo/client';

const ALL_MESSAGES_QUERY = gql`
  query($channelId: Int!) {
    allMessages(channelId: $channelId) {
      id
      text
      user {
        username
      }
      createdAt
    }
  }
`;

export default ALL_MESSAGES_QUERY;