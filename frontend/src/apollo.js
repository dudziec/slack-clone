import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
  ApolloLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

const httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});

const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem('token'),
      refreshToken: localStorage.getItem('refreshToken')
    }
  },
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();

    const {
      response: { headers },
    } = context;

    if (headers) {
      const token = headers.get("x-token");
      const refreshToken = headers.get("x-refresh-token");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    return response;
  });
});

const middlewareLink  = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      "x-token": token ? `${token}` : "",
      "x-refresh-token": token ? `${refreshToken}` : "",
    },
  };
});

const httpLinkWithMiddleWare = afterwareLink.concat(middlewareLink.concat(httpLink));

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkWithMiddleWare
);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

client.query({
  query: gql`
    query {
      allUsers {
        id
      }
    }
  `,
});

export default client;
