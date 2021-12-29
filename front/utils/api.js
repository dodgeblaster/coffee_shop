import { API, graphqlOperation } from 'aws-amplify'

export async function query({ query, data }) {
    return await API.graphql(graphqlOperation(query, data))
}

export function makeSubscription({ query, variables, sub, next }) {
    sub = API.graphql(graphqlOperation(query, variables)).subscribe({
        next
    })
}

export function removeSubscription(sub) {
    sub.unsubscribe()
}
