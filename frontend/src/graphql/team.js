import { gql } from '@apollo/client';

export const ALL_TEAMS_QUERY = gql`
  query {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;