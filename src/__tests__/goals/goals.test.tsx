import * as nextNavigation from 'next/navigation'
import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, waitFor} from '@testing-library/react'

import GoalsPage from '@/app/goals/[goalId]/page'
import * as api from '@/lib/api'

// useParams 모킹
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: jest.fn(),
    useRouter: jest.fn(),
    useToast: jest.fn(),
}))
beforeEach(() => {
    ;(nextNavigation.useParams as jest.Mock).mockReturnValue({goalId: 2479})
})

// api통신 모킹
jest.mock('@/lib/api')
const mockedGet = api.get as jest.MockedFunction<typeof api.get>
// const mockedPatch = api.patch as jest.MockedFunction<typeof api.patch>
// const mockedDel = api.del as jest.MockedFunction<typeof api.del>
jest.mock('@/hooks/use-toast')

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {retry: false},
        },
    })

function renderWithClient(ui: React.ReactElement) {
    const queryClient = createQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const mockGoal = {
    id: 2479,
    title: '아바타 사진찍기!!',
}

describe('api 호출 테스트', () => {
    it('goalDataApi 호출 확인', async () => {
        mockedGet.mockResolvedValueOnce({
            data: mockGoal,
            status: 200,
        })

        renderWithClient(<GoalsPage />)

        expect(mockedGet).toHaveBeenCalledWith(expect.objectContaining({endpoint: `goals/${mockGoal.id}`}))
    })
    it('todosNotDone(done=false) API가 호출되는지 확인', async () => {
        mockedGet.mockResolvedValueOnce({
            data: {todos: [{id: 1, content: '할 일 항목'}], nextCursor: 2},
            status: 200,
        })

        renderWithClient(<GoalsPage />)

        await waitFor(() => {
            expect(mockedGet).toHaveBeenCalledWith({endpoint: `todos?goalId=${mockGoal.id}&done=false&size=10`})
        })
    })

    it('todosDone(done=true) API가 호출되는지 확인', async () => {
        mockedGet.mockResolvedValueOnce({
            data: {todos: [{id: 2, content: '한 일 항목'}], nextCursor: 2},
            status: 200,
        })

        renderWithClient(<GoalsPage />)

        await waitFor(() => {
            expect(mockedGet).toHaveBeenCalledWith({endpoint: `todos?goalId=${mockGoal.id}&done=true&size=10`})
        })
    })
    it('API 로딩 중이면 loading-spinner 가 화면에 나타나야 한다', async () => {
        mockedGet.mockImplementation(
            () =>
                new Promise(() => {
                    //응답지연
                }),
        )

        const {container} = renderWithClient(<GoalsPage />)

        const spinner = container.querySelector('.animate-spin')
        expect(spinner).toBeInTheDocument()
    })
})
