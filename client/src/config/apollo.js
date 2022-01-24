import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';

const httpLink = createUploadLink({
    uri: "http://localhost:4000/graphql",
          
});

const client = new ApolloClient({
    connectToDevTools: true,
    link: httpLink,
    cache: new InMemoryCache(),
});

export default client;
