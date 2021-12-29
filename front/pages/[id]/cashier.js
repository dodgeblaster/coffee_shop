import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout from '../../components/Layout'
import ProductItem from '../../components/ProductItem'
import InFocusCard from '../../components/InFocusCard'
import OrderItem from '../../components/OrderItem'
import PrimaryButton from '../../components/PrimaryButton'
import Popup from '../../components/Popup'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import products from '../../utils/products'

import { submitPayment, usePaymentSubscription } from '../../api'

const titleStyles = {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 900
    // fontStyle: 'italic'
}

function ShoppingCardIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#146D26"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
        </svg>
    )
}

function WorkingIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 animate-spin text-gray-400 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
        </svg>
    )
}
function CheckMarkIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#146D26"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    )
}

function EmptyOrder() {
    return (
        <InFocusCard>
            <div className="relative">
                <div className="absolute w-full mt-20 flex justify-center">
                    <div className="border border-gray-200 rounded px-4 py-4 flex items-center flex-col">
                        <p className="flex items-center">
                            <ShoppingCardIcon />
                            New Order
                        </p>
                        <p className="italic text-xs text-gray-400">
                            Select a product to start a new order
                        </p>
                    </div>
                </div>
                <div className="opacity-0">
                    <p style={titleStyles} className="mb-4">
                        Order for Jane
                    </p>
                    <div
                        className="overflow-y-scroll"
                        style={{
                            height: 300
                        }}
                    >
                        <OrderItem name="Medium Coffee" price={200} />
                        <OrderItem name="Medium Coffee" price={200} />
                        <OrderItem name="Medium Coffee" price={200} />
                    </div>
                    <PrimaryButton onClick={() => {}}>
                        Start Payment
                    </PrimaryButton>
                </div>
            </div>
        </InFocusCard>
    )
}

function CurrentOrder(props) {
    const [name, setName] = useState('CustomerName')
    return (
        <InFocusCard>
            <div>
                <div style={titleStyles} className="mb-4 flex items-center">
                    <p className="m-0"> Order for </p>
                    <input
                        onChange={(x) => setName(x.target.value)}
                        value={name}
                        className={
                            name === '' ? 'ml-0 px-2 py-1' : 'ml-0 px-2 py-1'
                        }
                    />
                </div>
                <div
                    className="overflow-y-scroll"
                    style={{
                        height: 300
                    }}
                >
                    {props.items.map((x) => (
                        <OrderItem
                            key={x.id}
                            name={x.name}
                            price={x.price}
                            remove={() => props.remove(x.id)}
                        />
                    ))}
                </div>
                <PrimaryButton onClick={props.startPayment}>
                    Start Payment
                </PrimaryButton>
            </div>
        </InFocusCard>
    )
}

function makeRandomId() {
    let ID = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (var i = 0; i < 12; i++) {
        ID += characters.charAt(Math.floor(Math.random() * 36))
    }
    return ID
}

const SUBMIT_PAYMENT = (storeId) => `mutation MyMutation($products: [String]) {
        submitPayment(
            input: {
                amount: 10,
                products: $products,
                storeId: "${storeId}"
            }
        ){
            pk
            sk
            id
            amount
            cashier
            time
            storeId
            products

        }
    }
`

const SUBSCRIPTION = (storeId) => `
subscription MySubscription {
    paymentCompletedSub(pk: "${storeId}") {
        pk
        sk
        id
        status
        statusDetails
        time
    }
}
`

let subscription

export default function Home() {
    const [items, setItems] = useState([])
    const [currentPaymentId, setCurrentPaymentId] = useState(null)
    const [paymentStatus, setPaymentStatus] = useState('none')

    const [paymentStarted, setPaymentStarted] = useState({})
    //const [paymentSuccesses, setPaymentSuccesses] = useState({})
    const [paymentSuccesses] = usePaymentSubscription()
    const router = useRouter()
    const { id } = router.query

    // useEffect(() => {
    //     const sub = SUBSCRIPTION(id)

    //     subscription = API.graphql({
    //         query: sub,
    //         authMode: 'AMAZON_COGNITO_USER_POOLS'
    //     }).subscribe({
    //         next: (res) => {
    //             const x = res.value.data.paymentCompletedSub

    //             setPaymentSuccesses((xx) => ({
    //                 ...xx,
    //                 [x.id]: true
    //             }))
    //         }
    //     })
    // }, [])

    const removeItem = (id) => {
        setItems(items.filter((x) => x.id !== id))
    }

    const startPayment = async () => {
        if (currentPaymentId) {
            return
        }

        const products = JSON.stringify(items)

        setPaymentStatus('waiting')
        // const x = await API.graphql({
        //     query: SUBMIT_PAYMENT(id, products),
        //     variables: {
        //         products: items.map((x) => x.id)
        //     },
        //     authMode: 'AMAZON_COGNITO_USER_POOLS'
        // })

        const x = await submitPayment({
            storeId: id,
            amount: 500,
            products: products
        })

        setPaymentStarted((started) => ({
            ...started,
            [x.id]: true
        }))
        setCurrentPaymentId(x.id)
        setPaymentStatus('none')
    }

    let processing = Object.keys(paymentStarted).reduce((acc, x) => {
        if (acc) return acc
        if (!Object.keys(paymentSuccesses).find((success) => x === success)) {
            return x
        }
        return false
    }, false)

    let paymentDerivedStatus = 'none'
    if (paymentStatus === 'waiting') {
        paymentDerivedStatus = 'waiting'
    } else if (processing) {
        paymentDerivedStatus = 'processing'
    } else if (currentPaymentId && !processing) {
        paymentDerivedStatus = 'ok'
        setTimeout(() => {
            setCurrentPaymentId(null)
            setItems([])
        }, 2000)
    }

    return (
        <div className="">
            <Head>
                <title>Coffee App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {processing && (
                <div
                    style={{
                        zIndex: 100000
                    }}
                    className="text-white absolute top-2 right-2 text-right"
                >
                    {processing}
                </div>
            )}
            {paymentDerivedStatus !== 'none' && (
                <Popup>
                    {paymentDerivedStatus === 'ok' && (
                        <div className="px-2 py-2 h-20 flex items-center flex-col justify-center">
                            <CheckMarkIcon />
                            <p>Payment Successful!</p>
                        </div>
                    )}
                    {paymentDerivedStatus === 'waiting' && (
                        <div className="px-2 py-2 h-20 flex items-center flex-col justify-center">
                            <WorkingIcon />
                            <p>Waiting for Payment...</p>
                        </div>
                    )}
                    {paymentDerivedStatus === 'processing' && (
                        <div className="px-2 py-2 h-20 flex items-center flex-col justify-center">
                            <WorkingIcon />
                            <p>Processing Order...</p>
                        </div>
                    )}

                    <div className="px-2 py-2 border-t border-gray-100">
                        <PrimaryButton fullWidth={true}>Cancel</PrimaryButton>
                    </div>
                </Popup>
            )}

            <Layout title="Cashier">
                <div className="flex min-h-full">
                    <div className="flex-1 grid grid-cols-2 gap-0.5 auto-rows-min my-0">
                        {products.map((x) => (
                            <ProductItem
                                key={x.id}
                                name={x.name}
                                price={x.price}
                                onClick={() => {
                                    setItems([
                                        ...items,
                                        {
                                            id: x.id + '-' + makeRandomId(),
                                            name: x.name,
                                            price: x.price
                                        }
                                    ])
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex-1 pl-2 min-h-full">
                        {items.length === 0 ? (
                            <EmptyOrder />
                        ) : (
                            <CurrentOrder
                                items={items}
                                remove={removeItem}
                                startPayment={startPayment}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    )
}
