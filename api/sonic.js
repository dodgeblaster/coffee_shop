module.exports = {
    api: {
        makeadmin: [
            {
                type: 'input',
                email: 'string'
            },
            {
                type: 'users',
                action: 'add',
                email: '$email'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: 'admins',
                    sk: '$userId',
                    pass: '$password'
                }
            },
            {
                type: 'emit',
                name: 'userCreated',
                input: {
                    email: '$email',
                    type: 'admin'
                }
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string'
            }
        ],
        removeadmin: [
            {
                type: 'input',
                email: 'string'
            },
            {
                type: 'users',
                action: 'remove',
                email: '$email'
            },
            {
                type: 'db',
                action: 'remove',
                input: {
                    pk: 'admins',
                    sk: '$userId'
                }
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string'
            }
        ]
    },
    config: {
        name: 'sonic2',
        auth: true,
        eventBus: 'default',
        dashboard: true
    }
}
