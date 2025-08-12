import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'

import DashBoardPage from '@/app/dashboard/page'

export interface TodoData {
    totalTodos: number
    completedTodos: number
    pendingTodos: number
}

const mockTodos = [
    {id: 1, title: '테스트 할일 1', done: false},
    {id: 2, title: '테스트 할일 2', done: false},
]

describe('Dashboard 컴포넌트', () => {
    it('Dashboard rendering', () => {
        const queryClient = new QueryClient()

        render(
            <QueryClientProvider client={queryClient}>
                <DashBoardPage />
            </QueryClientProvider>,
        )

        expect(screen.getByText('대시보드')).toBeInTheDocument()
    })
})

jest.mock('@/lib/common-api', () => ({
    get: jest.fn(() =>
        Promise.resolve({
            data: {
                todos: mockTodos,
                nextCursor: 123,
            },
        }),
    ),
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
    }),
    usePathname: () => '/dashboard',
    useSearchParams: () => new URLSearchParams(),
}))
