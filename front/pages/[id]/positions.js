import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useRouter } from 'next/router'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'

export default function Home() {
    const router = useRouter()
    const { id } = router.query

    return (
        <AmplifyAuthenticator>
            <div className="">
                <Head>
                    <title>Coffee App</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <Layout title="Positions">
                    <div className="flex min-h-full">
                        <div className="flex my-2">
                            {['cashier', 'barista', 'products'].map((x) => (
                                <Link href={'/' + id + '/' + x} key={x}>
                                    <div
                                        className={`
                                    px-4 py-2 rounded border border-gray-200
                                    mr-2 mb-2 
                                    cursor-pointer
                                
                                `}
                                    >
                                        {x}
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
