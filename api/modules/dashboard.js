module.exports = {
    api: {
        getdashboards: [
            {
                type: 'input',
                storeId: 'string'
            },
            {
                type: 'guard',
                pk: '$storeId',
                sk: 'manager_{!sub}'
            },
            {
                type: 'db',
                action: 'list',
                input: {
                    pk: '$storeId',
                    sk: 'dashboard_customerwait_{@today}'
                }
            }
        ]
    }
    // events: {
    //     coffeecore_waitCalculated: []
    // }
}
