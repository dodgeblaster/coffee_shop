const AUTH_CHECK = {
    type: 'guard',
    pk: '$storeId',
    sk: 'staff_{!sub}'
}

module.exports = {
    api: {
        listproducts: [
            {
                type: 'input',
                storeId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: 'product_'
            },
            {
                type: 'db',
                action: 'list'
            }
        ],
        createproduct: [
            {
                type: 'input',
                name: 'string',
                price: 'number',
                storeId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: 'product_{@id}'
            },
            {
                type: 'db',
                action: 'set'
            },
            {
                type: 'output',
                name: 'string',
                price: 'number',
                sk: 'string'
            }
        ],
        updateproduct: [
            {
                type: 'input',
                name: 'string',
                price: 'number',
                storeId: 'string',
                productId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: '$productId'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '$storeId',
                    sk: '$productId',
                    name: '$name',
                    price: '$price'
                }
            },
            {
                type: 'output',
                name: 'string',
                price: 'number',
                sk: 'string'
            }
        ],
        removeproduct: [
            {
                type: 'input',
                storeId: 'string',
                productId: 'string'
            },
            AUTH_CHECK,
            {
                type: 'add',
                pk: '$storeId',
                sk: '$productId'
            },
            {
                type: 'db',
                action: 'remove'
            },
            {
                type: 'output',
                storeId: 'string',
                productId: 'string'
            }
        ]
    }
}
