'use client'

import {useRouter} from 'next/navigation'

import {useQuery, type UseQueryOptions, type QueryKey, type QueryFunction} from '@tanstack/react-query'

import useToast from '@/hooks/use-toast'

type ErrorDisplayType = 'toast' | 'redirect' | 'component' | 'both' | 'none'

type CustomQueryOptions<TData, TError, TQueryKey extends QueryKey, TSelected = TData> = Omit<
    UseQueryOptions<TData, TError, TSelected, TQueryKey>,
    'queryKey' | 'queryFunction'
> & {
    errorDisplayType?: ErrorDisplayType
    mapErrorMessage?: (error: TError) => string
    errorRedirectPath?: string
    onError?: (error: TError) => void
}

/**
 * React Query의 `useQuery`를 확장한 커스텀 훅으로,
 * 에러 발생 시 사용자에게 토스트로 알림을 띄우거나 페이지 리다이렉트를 처리할 수 있습니다.
 *
 * @template TData - 요청 결과 데이터 타입
 * @template TError - 에러 타입
 * @template TQueryKey - 쿼리 키 타입
 * @template TSelected - `select` 옵션으로 선택한 데이터 타입
 *
 * @param queryKey - 쿼리 키 (React Query의 캐싱 및 refetch 기준)
 * @param queryFunction - 데이터를 가져오는 비동기 함수
 * @param options - 쿼리 옵션 + 에러 처리 방식 추가
 *
 * @returns React Query의 `useQuery` 결과 객체
 */

export function useCustomQuery<TData, TError = unknown, TQueryKey extends QueryKey = QueryKey, TSelected = TData>(
    queryKey: TQueryKey,
    queryFunction: QueryFunction<TData, TQueryKey>,
    options: CustomQueryOptions<TData, TError, TQueryKey, TSelected> = {},
) {
    const {showToast} = useToast()
    const router = useRouter()

    const {
        errorDisplayType = 'toast',
        mapErrorMessage = (error: TError) =>
            (error as {message?: string})?.message ?? '데이터를 불러오던 중 문제가 발생했습니다.',
        errorRedirectPath = '/error',
        onError,
        ...rest
    } = options

    const queryResult = useQuery<TData, TError, TSelected, TQueryKey>({
        queryKey,
        queryFn: queryFunction,
        ...rest,
    })
    if (queryResult.isError && queryResult.error) {
        const message = mapErrorMessage(queryResult.error)

        if (['toast', 'both'].includes(errorDisplayType)) {
            showToast(message, {type: 'error'})
        }
        if (['redirect', 'both'].includes(errorDisplayType)) {
            const encodedMessage = encodeURIComponent(message)
            router.push(`${errorRedirectPath}?toast=${encodedMessage}`)
        }

        onError?.(queryResult.error as TError)
    }

    return queryResult
}
