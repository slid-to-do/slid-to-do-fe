// export interface InfiniteScrollOptions<T> {
//     queryKey: (string | number | boolean)[]
//     fetchFn: (cursor: number | undefined) => Promise<{
//         data: T[]
//         nextCursor: number | undefined
//     }>
// }
import type {UseInfiniteQueryOptions} from '@tanstack/react-query'

export interface InfiniteScrollOptions<T>
    extends Omit<
        UseInfiniteQueryOptions<
            {data: T[]; nextCursor: number | undefined}, // TQueryFnData
            Error, // TError
            {data: T[]; nextCursor: number | undefined}, // TData
            (string | number | boolean)[], // TQueryKey
            number | undefined // TPageParam
        >,
        'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'
    > {
    queryKey: (string | number | boolean)[]
    fetchFn: (pageParam?: number) => Promise<{data: T[]; nextCursor: number | undefined}>
}
