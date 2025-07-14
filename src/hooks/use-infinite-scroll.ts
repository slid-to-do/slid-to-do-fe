import {useCallback, useEffect, useState} from 'react'

import {useInView} from 'react-intersection-observer'

interface UseInfiniteScrollProperties<T> {
    fetchFn: (cursor: number | undefined) => Promise<{
        data: T[]
        nextCursor: number | undefined
    }>
}

export function useInfiniteScroll<T>({fetchFn}: UseInfiniteScrollProperties<T>) {
    const [data, setData] = useState<T[]>([])
    const [nextCursor, setNextCursor] = useState<number | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const {ref, inView} = useInView({threshold: 0.5})

    const fetchMore = useCallback(async () => {
        if (isLoading || nextCursor === null) return
        setIsLoading(true)
        try {
            const response = await fetchFn(nextCursor)
            setData((previous) => [...previous, ...response.data])
            setNextCursor(response.nextCursor)
        } finally {
            setIsLoading(false)
        }
    }, [nextCursor, fetchFn, isLoading])

    const reset = useCallback(async () => {
        setData([])
        setNextCursor(undefined)
        setIsLoading(true)
        try {
            const response = await fetchFn(nextCursor)
            setData(response.data)
            setNextCursor(response.nextCursor)
        } finally {
            setIsLoading(false)
        }
    }, [fetchFn, nextCursor])

    useEffect(() => {
        if (data.length === 0 && !isLoading) {
            fetchMore()
        }
    }, [data.length, isLoading, fetchMore])

    useEffect(() => {
        if (inView && !isLoading && nextCursor !== undefined && nextCursor !== null) {
            fetchMore()
        }
    }, [inView, isLoading, nextCursor, fetchMore])

    return {
        data,
        ref,
        isLoading,
        hasMore: nextCursor !== undefined,
        reset,
    }
}
