import * as nextNavigation from 'next/navigation'
import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'
import {waitFor} from '@testing-library/react'

import GoalsPage from '@/app/goals/[goalId]/page'
import * as api from '@/lib/api'

// useParams 모킹
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: jest.fn(),
    useRouter: () => ({push: jest.fn()}),
}))
beforeEach(() => {
    ;(nextNavigation.useParams as jest.Mock).mockReturnValue({goalId: 2488})
})

// api통신 모킹
jest.mock('@/lib/api')
const mockedGet = api.get as jest.MockedFunction<typeof api.get>
const mockedPatch = api.patch as jest.MockedFunction<typeof api.patch>
const mockedDel = api.del as jest.MockedFunction<typeof api.del>

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {queries: {retry: false}},
    })

function renderWithClient(ui: React.ReactElement) {
    const queryClient = createQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

const mockGoal = {
    id: 2488,
    title: '프로젝트 수정',
}

describe('goals 통합테스트', () => {
    describe('api 모킹', () => {
        it('goals/:goalId API 호출 후 goal 제목이 화면에 표시되는지 확인', async () => {
            mockedGet.mockResolvedValueOnce({
                data: mockGoal,
                status: 200,
            })

            renderWithClient(<GoalsPage />)

            // goal 제목이 렌더링되는지 확인
            expect(await screen.getByText('프로젝트 수정')).toBeInTheDocument()

            // 호출된 API 확인
            await waitFor(() => {
                expect(mockedGet).toHaveBeenCalledWith(
                    expect.objectContaining({
                        endpoint: 'goals/2474',
                    }),
                )
            })
        })
    })
})
