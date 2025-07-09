import {useCallback, useEffect, useState} from 'react'

import {useInView} from 'react-intersection-observer'

interface UseInfiniteScrollProperties<T> {
    fetchFn: (cursor: number) => Promise<{
        data: T[]
        nextCursor: number | undefined
    }>
}

export function useInfiniteScroll<T>({fetchFn}: UseInfiniteScrollProperties<T>) {
    const [data, setData] = useState<T[]>([])
    const [cursor, setCursor] = useState<number | undefined>(1)
    const [nextCursor, setNextCursor] = useState<number | undefined>()
    const [isLoading, setIsLoading] = useState(false)
    const {ref, inView} = useInView({threshold: 0.5})

    const fetchMore = useCallback(async () => {
        if (isLoading || cursor === undefined) return

        setIsLoading(true)
        try {
            const response = await fetchFn(cursor)
            setData((previous) => [...previous, ...response.data])
            setCursor(response.nextCursor)
            setNextCursor(response.nextCursor)
        } finally {
            setIsLoading(false)
        }
    }, [cursor, fetchFn, isLoading])

    useEffect(() => {
        if (data.length === 0) {
            fetchMore()
        }
    }, [data.length, fetchMore])

    useEffect(() => {
        if (inView && nextCursor !== undefined) {
            fetchMore()
        }
    }, [inView, nextCursor, fetchMore])

    return {
        data,
        ref,
        isLoading,
        hasMore: nextCursor !== undefined,
    }
}
