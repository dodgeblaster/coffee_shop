import Amplify, { Auth } from 'aws-amplify'

const config = {
    aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_BROADCAST_URL,
    aws_appsync_region: process.env.NEXT_PUBLIC_REGION,
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    Auth: {
        region: process.env.NEXT_PUBLIC_REGION,
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_POOL,
        userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_POOL_CLIENT
    },
    ssr: true,
    API: {
        endpoints: [
            {
                name: 'SONIC',
                endpoint: process.env.NEXT_PUBLIC_ENDPOINT,
                custom_header: async () => {
                    return {
                        Authorization: `Bearer ${(await Auth.currentSession())
                            .getIdToken()
                            .getJwtToken()}`
                    }
                }
            }
        ]
    }
}

Amplify.configure(config)
