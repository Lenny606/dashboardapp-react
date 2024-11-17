import {GraphQLFormattedError} from 'graphql'

type Error = {
    message: string;
    statusCode: string;
}
//wraps around fetch and add auth header
const customFetch = async (url: string, options: RequestInit) => {
    const token = localStorage.getItem("access_token");

    const headers = options.headers as Record<string, string>

    return await fetch(
        url,
        {
            ...options,
            headers: {
                ...headers,
                Authorization: headers?.Authorization || `Bearer ${token}`,
                "Content-Type": "application/json",
                //openg graph frontend client Apollo - helps with cors
                "Apollo-Require-Preflight": "true"
            }
        }
    )
}

//error handler
export const getGraphQLErrors = (body: Record<'errors', GraphQLFormattedError[] | undefined>): Error | null => {
    if (!body) {
        return {
            message: "Unknown error occurred",
            statusCode: 'INTERNAL_SERVER_ERROR'
        }
    }

    if ("errors" in body) {
        const errors = body?.errors
        const messages = errors?.map(error => error?.message)?.join('')
        const code = errors?.[0]?.extensions?.code

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || '500'
        }
    }
}
//custom wrapper/middleware with auth and error handling
export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options)
    //cannot read response 2x , need to clone
    const responseClone = response.clone()
    const body = await responseClone.json()

    const error = getGraphQLErrors(body)
    if (error) {
        throw error
    }
    return response
}