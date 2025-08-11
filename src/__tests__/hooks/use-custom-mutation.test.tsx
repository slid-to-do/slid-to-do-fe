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

import {renderHook, act, waitFor} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useCustomMutation} from '../../hooks/use-custom-mutation'

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {retry: false},
            mutations: {retry: false},
        },
    })
    return ({children}: {children: React.ReactNode}) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
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
        const mockFn = jest.fn().mockResolvedValue('success')
        const {result} = renderHook(() => useCustomMutation(mockFn), {
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
        expect(mockFn).toHaveBeenCalledWith('test')
        expect(result.current.error).toBeNull()
    })

    it('에러가 발생했을 때 상태를 처리한다', async () => {
        const error = new Error('fail')
        const mockFn = jest.fn().mockRejectedValue(error)
        const {result} = renderHook(() => useCustomMutation(mockFn), {
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
