import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
//import ApolloClient from '@apollo/client'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  uri: 'https://pray-track.hasura.app/v1/graphql',
  cache: new InMemoryCache(),
  headers: {
    'x-hasura-access-key': `HEdcmwFTFFgswT7QKRzFyqYlFrbRVyzXj9MiYiLVvI6R9RLq8kcjYCBAyEBPCE7t`,
  },
})

// client
//   .query({
//     query: gql`
//       query getTodos {
//         todos {
//           done
//           id
//           text
//         }
//       }
//     `,
//   })
//   .then((data) => console.log(data))

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
