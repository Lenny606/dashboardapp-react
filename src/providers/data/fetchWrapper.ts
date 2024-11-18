import { GraphQLFormattedError } from 'graphql'; // Importing the GraphQL error type

type Error = {
    message: string; // Error message to describe what went wrong
    statusCode: string; // Status code for the error
};

// Wraps around the fetch function to add authentication headers
const customFetch = async (url: string, options: RequestInit) => {
    const token = localStorage.getItem("access_token"); // Retrieve the access token from local storage

    // Cast the headers to a record of string keys and values
    const headers = options.headers as Record<string, string>;

    // Perform the fetch request with additional headers
    return await fetch(
        url,
        {
            ...options, // Keep the original options
            headers: {
                ...headers, // Merge existing headers
                Authorization: headers?.Authorization || `Bearer ${token}`, // Add Authorization header if not already present
                "Content-Type": "application/json", // Ensure the content type is JSON
                // Apollo client setting to handle CORS-related preflight
                "Apollo-Require-Preflight": "true"
            }
        }
    );
};

// Error handler to extract GraphQL errors from the response
export const getGraphQLErrors = (body: Record<'errors', GraphQLFormattedError[] | undefined>): Error | null => {
    if (!body) {
        // If the body is undefined, return a generic internal server error
        return {
            message: "Unknown error occurred",
            statusCode: 'INTERNAL_SERVER_ERROR'
        };
    }

    if ("errors" in body) {
        const errors = body?.errors; // Extract errors array if it exists in the body
        const messages = errors?.map(error => error?.message)?.join(''); // Combine all error messages into one string
        const code = errors?.[0]?.extensions?.code; // Get the error code from the first error in the array

        // Return the formatted error object
        return {
            message: messages || JSON.stringify(errors), // Use messages if available or stringify the errors
            statusCode: code || '500' // Default to status code 500 if not provided
        };
    }
};

// Custom wrapper/middleware for fetch with authentication and error handling
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options); // Make a request using customFetch with authentication
    const responseClone = response.clone(); // Clone the response since it can only be read once
    const body = await responseClone.json(); // Parse the response body to JSON

    const error = getGraphQLErrors(body); // Check for GraphQL errors in the response
    if (error) {
        throw error; // Throw an error if any are found
    }
    return response; // Return the original response if no errors are found
};
