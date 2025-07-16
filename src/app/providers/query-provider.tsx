'use client'

import {Suspense, useState} from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const QueryProvider = ({children}: {children: React.ReactNode}) => {
    const [client] = useState(new QueryClient())

    return (
        <QueryClientProvider client={client}>
            <Suspense>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
        </QueryClientProvider>
    )
}

export default QueryProvider
