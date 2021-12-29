const ORDER_STATUS_OUTPUT = {
    type: 'output',
    pk: 'string',
    sk: 'string',
    id: 'string',
    time: 'number'
}

module.exports = {
    api: {
        listorders: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'staff_{!sub}'
            },
            {
                type: 'add',
                pk: '{$storeId}_{@today}',
                sk: 'order_'
            },
            {
                type: 'db',
                action: 'list'
            }
        ],

        startorder: [
            {
                type: 'input',
                storeId: 'string',
                id: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'staff_{!sub}'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '{$storeId}_{@today}',
                    pk2: 'order_{$id}',
                    sk: 'order_{@now}_{$id}_started',
                    id: '$id',
                    time: '@now'
                }
            },
            {
                type: 'emit',
                event: 'orderStarted',
                input: {
                    storeId: '$storeId',
                    id: '$id'
                }
            },
            ORDER_STATUS_OUTPUT
        ],

        completeorder: [
            {
                type: 'input',
                storeId: 'string',
                id: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'staff_{!sub}'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '{$storeId}_{@today}',
                    pk2: 'order_{$id}',
                    sk: 'order_{@now}_{$id}_completed',
                    id: '$id',
                    time: '@now'
                }
            },
            {
                type: 'emit',
                event: 'orderCompleted',
                input: {
                    storeId: '$storeId',
                    id: '$id'
                }
            },
            ORDER_STATUS_OUTPUT
        ]
    },

    events: {
        coffeecore_paymentCompleted: [
            {
                type: 'input',
                storeId: 'string',
                id: 'string',
                status: 'string',
                statusDetails: 'string',
                products: 'string'
            },
            {
                type: 'db',
                action: 'set',
                input: {
                    pk: '{$storeId}_{@today}',
                    pk2: 'order_{$id}',
                    sk: 'order_{@now}_{$id}_added',
                    id: '$id',
                    time: '@now',
                    products: '$products'
                }
            },
            {
                type: 'broadcast',
                channel: 'orders',
                input: {
                    id: '$id',
                    time: '@now',
                    products: '$products'
                }
            }
        ]
    }
}
