import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './routes'
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
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
