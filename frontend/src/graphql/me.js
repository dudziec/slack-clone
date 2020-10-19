import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query {
    me {
      id
      username
      team {
        id
        name
        admin
        directMessageMembers {
          id
          username
        }
        channels {
          id
          name
        }
      }
    }
  }
`;
