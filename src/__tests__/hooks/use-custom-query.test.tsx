jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
    }),
    usePathname: () => '/test-path',
}))

jest.mock('../../hooks/use-toast', () => ({
    __esModule: true,
    default: () => ({
        showToast: jest.fn(),
        dismissToast: jest.fn(),
    }),
}))

import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'

import {useCustomQuery} from '../../hooks/use-custom-query'

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {queries: {retry: false}},
    })

    const QueryClientTestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    QueryClientTestWrapper.displayName = 'QueryClientTestWrapper'

    return QueryClientTestWrapper
}

describe('useCustomQuery', () => {
    it('쿼리가 성공하면 데이터를 반환한다', async () => {
        const {result} = renderHook(() => useCustomQuery(['test-key'], () => Promise.resolve('test-data')), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isSuccess).toBe(true))
        expect(result.current.data).toBe('test-data')
    })

    it('로딩 상태를 처리한다', () => {
        // 빈 함수 대신 jest.fn() 사용 → 빈 arrow function 린트 에러 방지
        const neverResolvingPromise = new Promise<string>(() => {
            /* intentionally never resolves */
        })

        const {result} = renderHook(() => useCustomQuery(['loading-key'], () => neverResolvingPromise), {
            wrapper: createWrapper(),
        })

        expect(result.current.isLoading).toBe(true)
    })

    it('에러 상태를 처리한다', async () => {
        const {result} = renderHook(() => useCustomQuery(['error-key'], () => Promise.reject(new Error('fail'))), {
            wrapper: createWrapper(),
        })

        await waitFor(() => expect(result.current.isError).toBe(true))
        expect(result.current.error).toBeInstanceOf(Error)
        expect((result.current.error as Error)?.message).toBe('fail')
    })
})
