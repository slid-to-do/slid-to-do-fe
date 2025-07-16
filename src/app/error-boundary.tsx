'use client'

import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import NotFound from './not-found'
import LoginPage from './login/page'

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    const {status, message} = error as Error & {status?: number; message: string}
    console.log('ErrorBoundary error:', error)
    if (status === 401) {
        return <LoginPage />
    }
    if (status === 404) {
        return <NotFound />
    }

    if (status === 409) {
        return <div>{message}</div>
    }
    return (
        <div role="alert">
            <p>Something went wrong:</p>

            <div className="flex flex-col items-center">
                <p>코드 : {status ?? '알 수 없음'}</p>
                <p className="mt-1">{message}</p>
            </div>
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
