module.exports = {
    api: {
        getstores: [
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: 'stores',
                    sk: 'store_'
                }
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string',
                storeName: 'string'
            }
        ],
        addstore: [
            {
                type: 'input',
                storeName: 'string'
            },
            {
                type: 'guard',
                pk: 'admins',
                sk: '!sub'
            },
            {
                type: 'add',
                pk: 'stores',
                sk: 'store_{@id}'
            },
            {
                type: 'db',
                action: 'set'
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string'
            }
        ],
        addstoremanager: [
            {
                type: 'input',
                email: 'string',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: 'admins',
                sk: '!sub'
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
                    pk: '$storeId',
                    sk: 'staff_{$userId}',
                    pass: '$password'
                }
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: 'manager_{$userId}'
                }
            },
            {
                type: 'emit',
                name: 'userCreated',
                input: {
                    email: '$email',
                    storeId: '$storeId',
                    type: 'manager'
                }
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string'
            }
        ],
        addstaff: [
            {
                type: 'input',
                email: 'string',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'manager_{!sub}'
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
                    pk: '$storeId',
                    sk: 'staff_{$userId}',
                    pass: '$password',
                    email: '$email'
                }
            },
            {
                type: 'emit',
                name: 'userCreated',
                input: {
                    email: '$email',
                    storeId: '$storeId',
                    type: 'staff'
                }
            },
            {
                type: 'output',
                pk: 'string',
                sk: 'string'
            }
        ]
    },
    events: {}
}
