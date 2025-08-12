import * as nextNavigation from 'next/navigation'
import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import InfiniteTodoList from '@/components/goals/todo-list'
import useToast from '@/hooks/use-toast'
import * as api from '@/lib/common-api'

const mockGoal = {
    id: 2479,
    title: '아바타 사진찍기!!',
}

// useParams 모킹
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: jest.fn(),
    useRouter: jest.fn(),
}))

// useToast 모킹
jest.mock('@/hooks/use-toast')
let mockShowToast: jest.Mock

// api통신 모킹
jest.mock('@/lib/common-api')
const mockedGet = api.get as jest.MockedFunction<typeof api.get>

beforeEach(() => {
    mockShowToast = jest.fn()
    ;(nextNavigation.useParams as jest.Mock).mockReturnValue({goalId: String(mockGoal.id)})
    ;(useToast as jest.Mock).mockReturnValue({
        showToast: mockShowToast,
    })
    mockedGet.mockReset()
})

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {retry: false},
        },
    })

const renderWithClient = (ui: React.ReactElement) => {
    const queryClient = createQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

// 테스트를 위한 todolist props 객체
const mockTodo = [
    {
        id: 1,
        title: '할 일 제목',
        done: false,
        noteId: 1,
        goal: {id: 2479, title: '아바타 사진찍기!!'},
        userId: 1,
        teamId: '1',
        createdAt: '2025-08-07T00:00:00Z',
        updatedAt: '2025-08-07T00:00:00Z',
    },
]

const headerProperties = (overrides = {}) => ({
    title: '',
    todos: mockTodo,
    isLoading: false,
    hasMore: false,
    isBlue: false,
    refCallback: jest.fn(),
    onToggle: jest.fn(),
    onDelete: jest.fn(),
    onAddClick: jest.fn(),
    ...overrides,
})

describe('클릭 이벤트', () => {
    it('"할 일 추가" 버튼 클릭 시 AddTodoModal 열리는지 확인', async () => {
        const user = userEvent.setup()
        const mockAddTodoModal = jest.fn()

        renderWithClient(<InfiniteTodoList {...headerProperties({onAddClick: mockAddTodoModal})} />)

        const updateButton = await screen.findByText('할일 추가')

        await user.click(updateButton)

        expect(mockAddTodoModal).toHaveBeenCalled()
        expect(mockAddTodoModal).toHaveBeenCalledTimes(1)
    })
})
