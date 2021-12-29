import { API } from 'aws-amplify'
import { useState, useEffect } from 'react'
import products from './utils/products' // deal with this
const apiName = 'SONIC'
const path = '/dev/sonic'

const makeSonicCall = (action, input) => {
    const myInit = {
        body: {
            action,
            input
        }
    }
    return new Promise((res, rej) => {
        API.post(apiName, path, myInit)
            .then((response) => {
                res(response)
            })
            .catch((error) => {
                rej(error)
            })
    })
}

/**
 * General
 *
 */
export async function getstores() {
    return makeSonicCall('getstores', {})
}

/**
 * Products
 *
 */
export async function listproducts(props) {
    return makeSonicCall('listproducts', { storeId: props.storeId })
}

export async function createproduct(props) {
    return makeSonicCall('createproduct', {
        storeId: props.storeId,
        name: props.name,
        price: props.price
    })
}

export async function removeproduct(props) {
    return makeSonicCall('removeproduct', {
        storeId: props.storeId,
        productId: props.productId
    })
}

/**
 * Cashier
 *
 */
export async function submitPayment(props) {
    return makeSonicCall('submitpayment', {
        storeId: props.storeId,
        amount: props.amount,
        products: props.products
    })
}

export const usePaymentSubscription = () => {
    const channel = 'payments'
    const SUBSCRIPTION = `subscription MySubscription($name: String!) {
        mainSubscribe(name: $name) {
            data
            name
        }
    }`

    const [paymentSuccesses, setPaymentSuccesses] = useState({})
    useEffect(() => {
        const subscription = API.graphql({
            query: SUBSCRIPTION,
            variables: { name: channel },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        }).subscribe({
            next: ({ _, value }) => {
                const x = value.data.mainSubscribe.data
                const d = JSON.parse(x)
                setPaymentSuccesses((state) => ({
                    ...state,
                    [d.id]: true
                }))
            },
            error: (error) => console.warn(error)
        })

        return () => {
            return subscription.unsubscribe()
        }
    }, [])

    return [paymentSuccesses]
}

/**
 * Barista
 */
export async function listorders(props) {
    return makeSonicCall('listorders', { storeId: props.storeId })
}

export async function startorder(props) {
    return makeSonicCall('startorder', { storeId: props.storeId, id: props.id })
}

export async function completeorder(props) {
    return makeSonicCall('completeorder', {
        storeId: props.storeId,
        id: props.id
    })
}

export const useOrdersSubscription = (props) => {
    const getProductId = (x) =>
        x.split('-').reduce((acc, x, i, l) => {
            if (i === 0) return x
            if (i + 1 < l.length) {
                return acc + '-' + x
            }
            return acc
        }, '')

    const channel = 'orders'
    const SUBSCRIPTION = `subscription MySubscription($name: String!) {
        mainSubscribe(name: $name) {
            data
            name
        }
    }`

    const [orders, setOrders] = useState([])

    async function listorders() {
        return makeSonicCall('listorders', { storeId: props.storeId })
    }
    const listOrders = async () => {
        const ordersData = await listorders({
            storeId: props.storeId
        })

        const theOrders = ordersData.filter(
            (x) => !x.sk.includes('completed') && !x.sk.includes('started')
        )

        setOrders(
            theOrders.map((x) => ({
                name: x.name || 'No Name',
                id: x.id,
                products: JSON.parse(x.products).map((x) => {
                    return products.find((pr) => pr.id === getProductId(x.id))
                }),
                timeOrdered: x.time
            }))
        )
    }

    useEffect(() => {
        /**
         * Get List
         */
        listOrders()

        /**
         * Subscribe
         */

        const subscription = API.graphql({
            query: SUBSCRIPTION,
            variables: { name: channel },
            authMode: 'AMAZON_COGNITO_USER_POOLS'
        }).subscribe({
            next: ({ _, value }) => {
                const x = value.data.mainSubscribe.data
                const d = JSON.parse(x)

                setOrders((xx) => [
                    ...xx,
                    {
                        name: d.name || 'No Name',
                        id: d.id,
                        products: JSON.parse(d.products).map((x) =>
                            products.find((pr) => pr.id === getProductId(x.id))
                        ),
                        timeOrdered: d.time
                    }
                ])
            },
            error: (error) => console.warn(error)
        })

        return () => subscription.unsubscribe()
    }, [])

    return [orders]
}
