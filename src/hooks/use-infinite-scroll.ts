import {useInfiniteQuery, InfiniteData} from '@tanstack/react-query'
import {useInView} from 'react-intersection-observer'
import {useEffect} from 'react'

interface UseInfiniteScrollQueryProps<T> {
    queryKey: (string | number | boolean)[]
    fetchFn: (cursor: number | undefined) => Promise<{
        data: T[]
        nextCursor: number | undefined
    }>
}

export function useInfiniteScrollQuery<T>({queryKey, fetchFn}: UseInfiniteScrollQueryProps<T>) {
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error, isLoading} = useInfiniteQuery<
        {data: T[]; nextCursor: number | undefined},
        Error,
        {data: T[]; nextCursor: number | undefined},
        (string | number | boolean)[],
        number | undefined
    >({
        queryKey,
        queryFn: ({pageParam}) => fetchFn(pageParam),
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        initialPageParam: undefined,
    })

    const {ref, inView} = useInView({threshold: 0.5})

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const flatData =
        (data as InfiniteData<{data: T[]; nextCursor: number | undefined}> | undefined)?.pages.flatMap(
            (page) => page.data,
        ) ?? []

    return {
        data: flatData,
        ref,
        isLoading,
        hasMore: hasNextPage,
        isError,
        error,
    }
}
