import React from 'react'
import Head from 'next/head'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import Layout from '../../components/Layout'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { listproducts, removeproduct, createproduct } from '../../api'
import { useState, useEffect } from 'react'

const SignupForm = (props) => {
    return (
        <Formik
            initialValues={{ productName: '', price: 100 }}
            validationSchema={Yup.object({
                productName: Yup.string()
                    .max(15, 'Must be 15 characters or less')
                    .required('Required'),
                price: Yup.number()
                    .min(100, 'Must be at least 100')
                    .required('Required')
            })}
            onSubmit={(values, { setSubmitting }) => {
                props.submit(values).then(() => setSubmitting(false))
            }}
        >
            <Form>
                <div className="rounded-md shadow-md px-6 py-6 border border-gray-200">
                    <div className="flex flex-col">
                        <label htmlFor="productName">Product Name</label>
                        <Field
                            className="bg-gray-800 rounded px-2 py-2 text-gray-100"
                            name="productName"
                            type="text"
                        />
                        <ErrorMessage
                            name="productName"
                            className="text-red-600"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="price">Price</label>
                        <Field
                            className="bg-gray-800 rounded px-2 py-2 text-gray-100"
                            name="price"
                            type="number"
                        />
                        <ErrorMessage name="price" />
                    </div>
                    <button
                        type="submit"
                        className="rounded px-4 py-1 text-white text-sm mt-4"
                        style={{
                            background: '#146D26'
                        }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={props.cancel}
                        className="rounded inline-block ml-2 px-4 py-1 text-white text-sm mt-4"
                        style={{
                            background: '#146D26'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </Form>
        </Formik>
    )
}

const CloseButton = (props) => {
    const Svg = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    )

    return (
        <div
            onClick={props.onClick}
            className="bg-white rounded-full px-1 py-1 shadow border border-gray-100 cursor-pointer"
        >
            <Svg />
        </div>
    )
}

export default function ProductsPage() {
    const router = useRouter()
    const { id } = router.query
    const [list, setList] = useState([])
    const [showAdd, setShowAdd] = useState(false)

    async function setTheList() {
        const x = await listproducts({
            storeId: id
        })

        setList(x)
    }

    useEffect(() => {
        setTheList()
    }, [])

    const remove = async (productId) => {
        await removeproduct({
            storeId: id,
            productId: productId
        })
        await setTheList()
    }

    const p = async (x) => {
        await createproduct({
            storeId: id,
            name: x.productName,
            price: x.price
        })
        await setTheList()
        setShowAdd(false)
    }
    return (
        <AmplifyAuthenticator>
            <div className="">
                <Head>
                    <title>Coffee App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Layout title="Products">
                    <div
                        style={{
                            width: 600,
                            margin: '0 auto'
                        }}
                    >
                        {showAdd && (
                            <SignupForm
                                submit={p}
                                cancel={() => setShowAdd(false)}
                            />
                        )}
                        <div
                            onClick={() => setShowAdd(true)}
                            className="rounded-md mt-2 border bg-gray-800 text-white px-6 py-6 flex relative"
                            style={{
                                background: '#146D26'
                            }}
                        >
                            <span>Add Product</span>
                        </div>
                        {list.map((x) => (
                            <div className="rounded-md mt-2 border border-gray-200 px-6 py-6 flex relative">
                                <span>{x.name}</span>
                                <span className="inline-block ml-auto font-bold">
                                    {x.price}
                                </span>
                                <CloseButton
                                    onClick={() => {
                                        remove(x.sk)
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </Layout>
            </div>
        </AmplifyAuthenticator>
    )
}
