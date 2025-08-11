import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import DashBoardPage from '@/app/dashboard/page'
import GoalListBody from '@/app/dashboard/components/body/goal-list-body'

export interface TodoData {
    totalTodos: number
    completedTodos: number
    pendingTodos: number
}

export interface DashboardProps {
    todoData?: TodoData | null
    isLoading?: boolean
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
