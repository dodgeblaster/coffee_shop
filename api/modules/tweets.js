const AUTH_CHECK = {
    type: 'guard',
    pk: '$storeId',
    sk: 'staff_{!sub}'
}

module.exports = {
    api: {
        listtweets: [
            {
                type: 'input',
                storeId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: 'tweet_'
            },
            {
                type: 'db',
                action: 'list'
            }
        ],
        createtweet: [
            {
                type: 'input',
                tweet: 'string',
                hashtags: 'string',
                storeId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: 'tweet_{@id}'
            },
            {
                type: 'db',
                action: 'set'
            },
            {
                type: 'output',
                tweet: 'string',
                hashtags: 'string',
                sk: 'string'
            }
        ],
        removetweet: [
            {
                type: 'input',
                storeId: 'string',
                tweetId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: '$tweetId'
            },
            {
                type: 'db',
                action: 'remove'
            },
            {
                type: 'output',
                storeId: 'string',
                tweetId: 'string'
            }
        ]
    }
}
