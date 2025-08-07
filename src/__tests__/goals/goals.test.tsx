import * as nextNavigation from 'next/navigation'
import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, waitFor, screen} from '@testing-library/react'

import GoalsPage from '@/app/goals/[goalId]/page'
import useToast from '@/hooks/use-toast'
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

// useToast 모킹
jest.mock('@/hooks/use-toast')
beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({
        showToast: jest.fn(),
    })
})

// api통신 모킹
jest.mock('@/lib/api')
const mockedGet = api.get as jest.MockedFunction<typeof api.get>
// const mockedPatch = api.patch as jest.MockedFunction<typeof api.patch>
// const mockedDel = api.del as jest.MockedFunction<typeof api.del>

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
    it.each([
        ['done=true', '할 일을 불러오는 중 오류가 발생했습니다.'],
        ['done=false', '할 일을 불러오는 중 오류가 발생했습니다.'],
    ])('endpoint가 %s일 때 toast가 호출되는지 확인', async (endpointSubstring, expectedToastMessage) => {
        // 1. showToast 함수 모킹
        const mockShowToast = jest.fn()
        ;(useToast as jest.Mock).mockReturnValue({showToast: mockShowToast})

        // 2. API 에러 상황 강제 트리거
        mockedGet.mockImplementation(({endpoint}) => {
            if (endpoint.includes(endpointSubstring)) {
                return Promise.reject(new Error('API 실패'))
            }
            return Promise.resolve({
                data: {todos: [], nextCursor: 1},
                status: 200,
            })
        })

        // 3. 렌더링
        renderWithClient(<GoalsPage />)

        // 4. 기대 결과 확인
        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith(expectedToastMessage)
        })
    })
})

describe('클릭 이벤트', () => {
    it('노트 링크가 goalId에 따라 정확히 렌더링 되는지 확인', async () => {
        renderWithClient(<GoalsPage />)

        const noteLink = screen.getByRole('link', {name: /노트 모아보기/i})
        expect(noteLink).toHaveAttribute('href', `/notes?goalId=${mockGoal.id}`)
    })
})
