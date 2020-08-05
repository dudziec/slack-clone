import React from "react";
import { gql, useQuery } from "@apollo/client";

const allUserQuery = gql`
  query {
    allUsers {
      id
      email
    }
  }
`;

const Home = () => {
  const { loading, data } = useQuery(allUserQuery);

  if (loading) return <p>Loading...</p>;

  return data.allUsers.map(({ id, email }) => <h1 key={id}>{email}</h1>);
};

export default Home;
