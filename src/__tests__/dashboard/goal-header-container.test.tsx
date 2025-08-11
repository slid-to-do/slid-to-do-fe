import React from 'react'

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {render, screen, waitFor} from '@testing-library/react'

import Header from '@/app/dashboard/components/header/header-container'
import * as api from '@/lib/common-api'

jest.mock('next/dynamic', () => {
    const MockProgressComponent = (properties: Record<string, unknown>) => (
        <div data-testid="mock-progress" {...properties} />
    )
    MockProgressComponent.displayName = 'MockProgressComponent'
    return () => MockProgressComponent
})

jest.mock('next/image', () => {
    const MockImageComponent = (properties: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img {...properties} alt={properties.alt || 'image'} />
    )
    MockImageComponent.displayName = 'MockImageComponent'
    return MockImageComponent
})

jest.mock('@/lib/common-api')

const mockedGet = api.get as jest.MockedFunction<typeof api.get>

const createQueryClient = () => new QueryClient({defaultOptions: {queries: {retry: false, gcTime: 0, staleTime: 0}}})

function renderWithClient(ui: React.ReactElement) {
    const queryClient = createQueryClient()
    return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe('Header', () => {
    beforeEach(() => {
        mockedGet.mockReset()
    })

    it('최근 등록한 할 일 목록과 진행률이 표시된다', async () => {
        mockedGet
            .mockResolvedValueOnce({
                data: {
                    todos: [
                        {
                            id: 1,
                            title: '첫 번째 할 일',
                            createdAt: '2025-08-10T00:00:00Z',
                            done: false,
                            goal: {id: 101},
                        },
                        {
                            id: 2,
                            title: '두 번째 할 일',
                            createdAt: '2025-08-09T00:00:00Z',
                            done: false,
                            goal: {id: 102},
                        },
                    ],
                },
                status: 200,
            })
            .mockResolvedValueOnce({data: {progress: 75}, status: 200})

        renderWithClient(<Header />)

        expect(await screen.findByText('첫 번째 할 일')).toBeInTheDocument()
        expect(await screen.findByText('두 번째 할 일')).toBeInTheDocument()
        expect(screen.getByTestId('mock-progress')).toBeInTheDocument()
    })

    it('할 일이 없으면 안내 문구를 표시한다', async () => {
        mockedGet
            .mockResolvedValueOnce({data: {todos: []}, status: 200})
            .mockResolvedValueOnce({data: {progress: 0}, status: 200})

        renderWithClient(<Header />)

        expect(await screen.findByText('최근 등록한 일이 없습니다.')).toBeInTheDocument()
    })

    it('API가 올바른 endpoint로 호출된다', async () => {
        mockedGet
            .mockResolvedValueOnce({data: {todos: []}, status: 200})
            .mockResolvedValueOnce({data: {progress: 0}, status: 200})

        renderWithClient(<Header />)

        await waitFor(() => {
            expect(mockedGet).toHaveBeenCalledWith(expect.objectContaining({endpoint: 'todos'}))
            expect(mockedGet).toHaveBeenCalledWith(expect.objectContaining({endpoint: 'todos/progress'}))
        })
    })
})
