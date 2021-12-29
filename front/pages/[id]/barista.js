import { useState, useEffect } from 'react'
import Head from 'next/head'

import Layout from '../../components/Layout'
import BaristaOrderItem from '../../components/BaristaOrderItem'
import InFocusCard from '../../components/InFocusCard'
import OrderItem from '../../components/OrderItem'
import PrimaryButton from '../../components/PrimaryButton'
import { useRouter } from 'next/router'
import products from '../../utils/products'
import {
    listorders,
    useOrdersSubscription,
    startorder,
    completeorder
} from '../../api'

const titleStyles = {
    fontFamily: '"Playfair Display", serif',
    fontWeight: 900
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

function EmptyOrder() {
    return (
        <InFocusCard>
            <div className="relative">
                <div className="absolute w-full mt-20 flex justify-center">
                    <div className="border border-gray-200 rounded px-4 py-4 flex items-center flex-col">
                        <p className="flex items-center">
                            <ShoppingCardIcon />
                            No Order Selected
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
                    {props.order.products.map((x) => (
                        <OrderItem
                            key={x.id}
                            name={x.name}
                            price={x.price}
                            remove={() => {}}
                        />
                    ))}
                </div>
                <PrimaryButton
                    disabled={props.started}
                    onClick={() => {
                        if (!props.started) {
                            props.start()
                        }
                    }}
                >
                    {props.started ? 'Started...' : 'Start'}
                </PrimaryButton>{' '}
                <PrimaryButton
                    disabled={props.completed}
                    onClick={() => {
                        if (!props.completed) {
                            props.complete()
                        }
                    }}
                >
                    {props.completed ? 'Completed!' : 'Complete'}
                </PrimaryButton>
            </div>
        </InFocusCard>
    )
}

export default function Home() {
    const router = useRouter()
    const { id } = router.query
    const [items, setItems] = useState([])
    const [orders] = useOrdersSubscription({
        storeId: id
    })

    const [selected, setSelected] = useState(false)
    const [ordersStarted, setOrdersStarted] = useState({})
    const [ordersCompleted, setOrdersCompleted] = useState({})

    const listOrders = async () => {
        const ordersData = await listorders({
            storeId: id
        })

        const started = ordersData.filter((x) => x.sk.includes('started'))
        setOrdersStarted(() =>
            started.reduce((acc, x) => {
                acc[x.id] = true
                return acc
            }, {})
        )

        const completed = ordersData.filter((x) => x.sk.includes('completed'))
        setOrdersCompleted(() =>
            completed.reduce((acc, x) => {
                acc[x.id] = true
                return acc
            }, {})
        )
    }
    useEffect(() => {
        listOrders()
    }, [])

    const startOrder = async (orderId) => {
        const x = await startorder({
            storeId: id,
            id: orderId
        })

        setOrdersStarted((xx) => ({
            ...xx,
            [x.id]: true
        }))
    }

    const completeOrder = async (paymentId) => {
        const x = await completeorder({
            storeId: id,
            id: paymentId
        })

        setOrdersCompleted((xx) => ({
            ...xx,
            [x.id]: true
        }))
        setSelected(false)
    }

    const removeItem = (id) => {
        setItems(items.filter((x) => x.id !== id))
    }

    return (
        <div className="">
            <Head>
                <title>Coffee App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Layout title="Barista">
                <div className="flex min-h-full">
                    <div className="flex-1 flex flex-col my-2">
                        {orders
                            .filter((o) => {
                                return !ordersCompleted[o.id]
                            })
                            .map((x) => (
                                <BaristaOrderItem
                                    selected={x.id === selected}
                                    started={
                                        ordersStarted[x.id]
                                            ? ordersStarted[x.id]
                                            : false
                                    }
                                    key={x.id}
                                    id={x.id}
                                    name={x.name}
                                    items={x.products}
                                    timeOrdered={x.timeOrdered}
                                    onClick={() => {
                                        setSelected(x.id)
                                    }}
                                />
                            ))}
                    </div>
                    <div className="flex-1 pl-2 min-h-full">
                        {selected === false ? (
                            <EmptyOrder />
                        ) : (
                            <CurrentOrder
                                order={
                                    orders.filter((x) => x.id === selected)[0]
                                }
                                products={products}
                                started={
                                    ordersStarted[selected]
                                        ? ordersStarted[selected]
                                        : false
                                }
                                start={() => startOrder(selected)}
                                completed={ordersCompleted[selected]}
                                complete={() => completeOrder(selected)}
                            />
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    )
}
