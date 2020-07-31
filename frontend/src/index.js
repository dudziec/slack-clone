import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes'
import { ApolloClient, InMemoryCache, gql, ApolloProvider, createHttpLink, ApolloLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import 'semantic-ui-css/semantic.min.css'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
});

const afterwareLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    const context = operation.getContext();

    const { response: { headers }} = context;

    if(headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if(token) {
        localStorage.setItem('token', token);
      }

      if(refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    } 
      
      return response;
  })
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      'x-token': token ? `${token}` : "",
      'x-refresh-oken': token ? `${refreshToken}` : "",
    }
  }
});

const client = new ApolloClient({
  link: from([authLink, afterwareLink, httpLink]),
  cache: new InMemoryCache()
});

client
  .query({
    query: gql`
    query {
      allUsers {
        id
      }
    }
    `
  })
  .then(result => console.log(result));

const App = (
  <ApolloProvider client={client}>
    <Routes/>
  </ApolloProvider>
);

ReactDOM.render(App,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
