import * as reactQuery from '@tanstack/react-query'
import {renderHook, waitFor} from '@testing-library/react'
import {mocked} from 'jest-mock'
import * as reactIntersectionObserver from 'react-intersection-observer'

import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'

jest.mock('@tanstack/react-query')
jest.mock('react-intersection-observer')

const useInfiniteQueryMock = mocked(reactQuery.useInfiniteQuery)
const useInViewMock = mocked(reactIntersectionObserver.useInView)

const createUseInfiniteQueryReturn = (overrides = {}) =>
    ({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isError: false,
        error: undefined,
        isLoading: true,
        ...overrides,
    }) as unknown as ReturnType<typeof useInfiniteQueryMock>

beforeEach(() => {
    useInViewMock.mockReturnValue({
        ref: jest.fn(),
        inView: false,
    } as unknown as ReturnType<typeof useInViewMock>)

    useInfiniteQueryMock.mockReturnValue(createUseInfiniteQueryReturn())
})

describe('useInfiniteScrollQuery 테스트', () => {
    it('isLoading이 true로 반환되어야 한다', () => {
        const {result} = renderHook(() =>
            useInfiniteScrollQuery({
                queryKey: ['test'],
                fetchFn: jest.fn(),
            }),
        )

        expect(result.current.isLoading).toBe(true)
        expect(result.current.data).toEqual([])
        expect(result.current.hasMore).toBe(false)
        expect(typeof result.current.ref).toBe('function')
    })

    it('fetchFn이 성공적으로 데이터를 반환하면 flatData가 병합되어야 한다', () => {
        useInfiniteQueryMock.mockReturnValueOnce(
            createUseInfiniteQueryReturn({
                data: {
                    pages: [
                        {data: ['item1', 'item2'], nextCursor: 1},
                        {data: ['item3', 'item4'], nextCursor: undefined},
                    ],
                    pageParams: [undefined, 1],
                },
                isLoading: false,
            }),
        )

        const {result} = renderHook(() =>
            useInfiniteScrollQuery({
                queryKey: ['test'],
                fetchFn: jest.fn(),
            }),
        )

        expect(result.current.data).toEqual(['item1', 'item2', 'item3', 'item4'])
    })

    it('inView=false일 때 fetchNextPage 호출되지 않아야 한다', async () => {
        const fetchNextPageMock = jest.fn()

        useInfiniteQueryMock.mockReturnValueOnce(
            createUseInfiniteQueryReturn({
                fetchNextPage: fetchNextPageMock,
                hasNextPage: false,
                isFetchingNextPage: false,
                isLoading: false,
            }),
        )

        renderHook(() =>
            useInfiniteScrollQuery({
                queryKey: ['test'],
                fetchFn: jest.fn(),
            }),
        )

        await waitFor(() => {
            expect(fetchNextPageMock).not.toHaveBeenCalled()
        })
    })
})
