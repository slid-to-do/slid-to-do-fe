'use client'

import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import NotFound from './not-found'
import LoginPage from './login/page'

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    const status = (error as Error & {status?: number}).status

    if (status === 401) {
        return <LoginPage />
    }
    if (status === 404) {
        return <NotFound />
    }
    return (
        <div role="alert">
            <p>Something went wrong:</p>

            <p>
                <span>코드 : {error.status}</span>
                <span>{error.message}</span>
            </p>
            <button
                onClick={resetErrorBoundary}
                className="mt-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Try again
            </button>
        </div>
    )
}

export const ErrorBoundaryWrapper = ({children, onReset}: {children: React.ReactNode; onReset: () => void}) => {
    return (
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={onReset}>
            {children}
        </ErrorBoundary>
    )
}
