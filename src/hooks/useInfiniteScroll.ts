import {useCallback, useEffect, useState} from 'react'
import {useInView} from 'react-intersection-observer'

interface UseInfiniteScrollProps<T> {
    fetchFn: (cursor: number) => Promise<{
        data: T[]
        nextCursor: number | null
    }>
}
export function useInfiniteScroll<T>({fetchFn}: UseInfiniteScrollProps<T>) {
    const [data, setData] = useState<T[]>([])
    const [cursor, setCursor] = useState<number | null>(1)
    const [nextCursor, setNextCursor] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const {ref, inView} = useInView({threshold: 1})

    const fetchMore = useCallback(async () => {
        if (isLoading || cursor === null) return

        setIsLoading(true)
        try {
            const res = await fetchFn(cursor)
            setData((prev) => [...prev, ...res.data])
            setCursor(res.nextCursor ?? null)
            setNextCursor(res.nextCursor)
        } finally {
            setIsLoading(false)
        }
    }, [cursor, fetchFn, isLoading])

    useEffect(() => {
        if (data.length === 0) {
            fetchMore()
        }
    }, [])

    useEffect(() => {
        if (inView && nextCursor !== null) {
            fetchMore()
        }
    }, [inView])

    return {
        data,
        ref,
        isLoading,
        hasMore: nextCursor !== null,
    }
}
