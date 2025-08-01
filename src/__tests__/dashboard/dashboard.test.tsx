import {render, screen} from '@testing-library/react'
import DashBoardPage from '@/app/dashboard/page'
import Header from '@/app/dashboard/components/header/header-container'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

export interface TodoData {
    totalTodos: number
    completedTodos: number
    pendingTodos: number
}

export interface DashboardProps {
    todoData?: TodoData | null
    isLoading?: boolean
}

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
