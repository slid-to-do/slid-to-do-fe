import React, {Suspense} from 'react'
import {ErrorBoundaryProvider} from '../providers/error-boundary-provider'

export const metadata = {
    title: 'notes',
}

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <ErrorBoundaryProvider>
            <Suspense>
                <main>{children}</main>
            </Suspense>
        </ErrorBoundaryProvider>
    )
}

export default layout
