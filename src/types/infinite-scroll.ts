export interface InfiniteScrollOptions<T> {
    queryKey: (string | number | boolean)[]
    fetchFn: (cursor: number | undefined) => Promise<{
        data: T[]
        nextCursor: number | undefined
    }>
}
