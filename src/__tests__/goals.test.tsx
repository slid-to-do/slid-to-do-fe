import * as nextNavigation from 'next/navigation'
import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen} from '@testing-library/react'

import GoalHeader from '@/components/goals/goal-header'

// useParams 모킹
jest.mock('next/navigation', () => ({
    ...jest.requireActual('next/navigation'),
    useParams: jest.fn(),
}))

beforeEach(() => {
    ;(nextNavigation.useParams as jest.Mock).mockReturnValue({goalId: 2474})
})

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

describe('GoalHeader', () => {
    it('목표 제목이 화면에 보여야 한다', () => {
        renderWithClient(
            <GoalHeader
                goal={mockGoal}
                goalTitle={mockGoal.title}
                goalEdit={false}
                setGoalEdit={() => {
                    /* 빈 함수 */
                }}
                moreButton={false}
                setMoreButton={() => {
                    /* 빈 함수 */
                }}
                goalDeleteModal={() => {
                    /* 빈 함수 */
                }}
                handleInputUpdate={() => {
                    /* 빈 함수 */
                }}
                handleGoalAction={() => {
                    /* 빈 함수 */
                }}
            />,
        )

        expect(screen.getByText('프로젝트 수정')).toBeInTheDocument()
    })
    it('목표 prograss 가 화면에 보여야 한다', async () => {
        renderWithClient(
            <GoalHeader
                goal={mockGoal}
                goalTitle={mockGoal.title}
                goalEdit={false}
                setGoalEdit={() => {
                    /* 빈 함수 */
                }}
                moreButton={false}
                setMoreButton={() => {
                    /* 빈 함수 */
                }}
                goalDeleteModal={() => {
                    /* 빈 함수 */
                }}
                handleInputUpdate={() => {
                    /* 빈 함수 */
                }}
                handleGoalAction={() => {
                    /* 빈 함수 */
                }}
            />,
        )

        expect(await screen.findByText(/%/)).toBeInTheDocument()
    })
})
