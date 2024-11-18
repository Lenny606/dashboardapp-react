// Import required modules and functions from refinedev/nestjs-query and graphql-ws
import graphqlDataProvider, {GraphQLClient, liveProvider as graphqlLiveProvider} from "@refinedev/nestjs-query";
import {createClient} from "graphql-ws";
import {fetchWrapper} from "./fetchWrapper";

// Define the base URL and API endpoints
export const BASE_URL = 'https://api.crm.refine.dev'; // Base URL for the CRM API
export const API_URL = 'https://api.crm.refine.dev'; // API endpoint for GraphQL client
export const WS_URL = 'wss://api.crm.refine.dev/graphql'; // WebSocket URL for live updates

// Create an instance of GraphQLClient for making API requests
export const client = new GraphQLClient(API_URL, {
    fetch: (url: string, options: RequestInit) => {
        try {
            // Use fetchWrapper to make the API call with provided URL and options
            return fetchWrapper(url, options);
        } catch (e) {
            // If an error occurs during the fetch, return a rejected promise
            return Promise.reject(e as Error);
        }
    }
});

// Create a WebSocket client for handling real-time data updates
export const wsClient = typeof window !== 'undefined'
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
            // Retrieve access token from local storage
            const accessToken = localStorage.getItem('access_token');
            return {
                headers: {
                    authorization: `Bearer ${accessToken}`,
                },
            };
        }
    })
    : undefined; // WebSocket client is undefined if not in a browser environment

// Initialize data provider for interacting with the API using GraphQL
export const dataProvider = graphqlDataProvider(client);

// Initialize live provider for real-time data updates using WebSocket
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;
