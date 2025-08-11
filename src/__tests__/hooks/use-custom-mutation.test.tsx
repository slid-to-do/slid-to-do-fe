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
import {renderHook, act, waitFor} from '@testing-library/react'

import {useCustomMutation} from '../../hooks/use-custom-mutation'

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {retry: false},
            mutations: {retry: false},
        },
    })

    const QueryClientTestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    QueryClientTestWrapper.displayName = 'QueryClientTestWrapper'

    return QueryClientTestWrapper
}

describe('useCustomMutation', () => {
    it('기본 상태로 초기화된다', () => {
        const {result} = renderHook(() => useCustomMutation(jest.fn()), {
            wrapper: createWrapper(),
        })
        expect(result.current.status).not.toBe('loading')
        expect(result.current.isError).toBe(false)
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBeNull()
    })

    it('mutate 호출 후 성공 시 상태를 업데이트한다', async () => {
        const mockFunction = jest.fn().mockResolvedValue('success') // ← rename
        const {result} = renderHook(() => useCustomMutation(mockFunction), {
            wrapper: createWrapper(),
        })

        act(() => {
            result.current.mutate('test')
        })

        await waitFor(() => {
            expect(result.current.status).not.toBe('loading')
            expect(result.current.isError).toBe(false)
            expect(result.current.data).toBe('success')
        })
        expect(mockFunction).toHaveBeenCalledWith('test')
        expect(result.current.error).toBeNull()
    })

    it('에러가 발생했을 때 상태를 처리한다', async () => {
        const error = new Error('fail')
        const mockFunction = jest.fn().mockRejectedValue(error) // ← rename
        const {result} = renderHook(() => useCustomMutation(mockFunction), {
            wrapper: createWrapper(),
        })

        act(() => {
            result.current.mutate('test')
        })

        await waitFor(() => {
            expect(result.current.status).not.toBe('loading')
            expect(result.current.isError).toBe(true)
        })
        expect(result.current.data).toBeUndefined()
        expect(result.current.error).toBe(error)
    })
})
