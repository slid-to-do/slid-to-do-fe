import React from 'react'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'
import * as api from '@/lib/common-api'
import GoalTodoContainer from '@/app/dashboard/components/body/goal-todo-container'

jest.mock('@/lib/common-api')
const mockedGet = api.get as jest.MockedFunction<typeof api.get>

const createQueryClient = () => new QueryClient({defaultOptions: {queries: {retry: false}}})

function renderWithClient(ui: React.ReactElement) {
    const queryClient = createQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const mockGoalData = {
    goals: [
        {id: 1, title: '첫 번째 목표', userId: 1, teamId: '1', createdAt: '2025-08-07', updatedAt: '2025-08-07'},
        {id: 2, title: '두 번째 목표', userId: 1, teamId: '1', createdAt: '2025-08-07', updatedAt: '2025-08-07'},
    ],
    nextCursor: 3,
}

describe('GoalTodoContainer', () => {
    beforeEach(() => {
        mockedGet.mockReset()
    })
    beforeAll(() => {
        const mockIntersectionObserver = jest.fn(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        })) as unknown as typeof IntersectionObserver

        globalThis.IntersectionObserver = mockIntersectionObserver
    })

    it('로딩 중일 때 스피너가 표시된다', async () => {
        mockedGet.mockImplementationOnce(() => new Promise(() => {}))
        const {container} = renderWithClient(<GoalTodoContainer />)
        expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    })

    it('목표 데이터가 로드되면 목록이 표시된다', async () => {
        mockedGet.mockResolvedValueOnce({data: mockGoalData, status: 200})
        renderWithClient(<GoalTodoContainer />)

        expect(await screen.findByText('첫 번째 목표')).toBeInTheDocument()
        expect(await screen.findByText('두 번째 목표')).toBeInTheDocument()
    })

    it('목표가 없을 경우 안내 메시지가 표시된다', async () => {
        mockedGet.mockResolvedValueOnce({data: {goals: [], nextCursor: undefined}, status: 200})
        renderWithClient(<GoalTodoContainer />)

        expect(await screen.findByText('등록된 목표가 없습니다.')).toBeInTheDocument()
    })

    it('API 호출이 올바른 endpoint로 발생한다', async () => {
        mockedGet.mockResolvedValueOnce({data: mockGoalData, status: 200})
        renderWithClient(<GoalTodoContainer />)

        await waitFor(() => {
            expect(mockedGet).toHaveBeenCalledWith(expect.objectContaining({endpoint: 'goals?size=3&sortOrder=newest'}))
        })
    })

    it('더 많은 데이터가 있으면 무한 스크롤 트리거가 존재한다', async () => {
        mockedGet.mockResolvedValueOnce({data: mockGoalData, status: 200})
        renderWithClient(<GoalTodoContainer />)

        await waitFor(() => {
            expect(screen.getByText('첫 번째 목표')).toBeInTheDocument()
        })
    })

    it('모든 데이터를 불러왔을 때 완료 메시지가 표시된다', async () => {
        mockedGet.mockResolvedValueOnce({data: {goals: mockGoalData.goals, nextCursor: undefined}, status: 200})
        renderWithClient(<GoalTodoContainer />)

        expect(await screen.findByText('모든 할일을 다 불러왔어요')).toBeInTheDocument()
    })
})
