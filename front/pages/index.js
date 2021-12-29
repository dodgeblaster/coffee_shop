import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import { getstores } from '../api'

export default function Home() {
    const [items, setItems] = useState([])
    const getStores = async () => {
        const xx = await getstores()
        setItems(xx)
    }

    useEffect(() => {
        getStores()
    }, [])

    return (
        <AmplifyAuthenticator>
            <div className="">
                <Head>
                    <title>Coffee App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Layout title="Stores">
                    <div className="flex min-h-full">
                        <div className="flex my-2">
                            {items.map((x) => (
                                <Link
                                    href={'/' + x.sk + '/positions'}
                                    key={x.sk}
                                >
                                    <div
                                        className={`
                                    px-4 py-2 rounded border border-gray-200
                                    mr-2 mb-2 
                                    cursor-pointer
                                
                                `}
                                    >
                                        {x.storeName}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </Layout>
            </div>
        </AmplifyAuthenticator>
    )
}
