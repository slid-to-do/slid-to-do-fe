'use client'

import useToast from '@/hooks/use-toast'
import {useMutation, UseMutationOptions} from '@tanstack/react-query'
import {FieldValues, UseFormSetError} from 'react-hook-form'

type ErrorDisplayType = 'toast' | 'form' | 'both' | 'none'

type CustomMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
> & {
    setError?: UseFormSetError<FieldValues>
    onValidationError?: (error: any) => {name: string; message: string}[] // 에러 객체 → 폼 필드 매핑
    errorDisplayType?: ErrorDisplayType // <-- 추가
}

/**
 * React Query의 `useMutation`을 확장하여,
 * 폼 에러 처리와 토스트 알림을 통합적으로 처리할 수 있는 커스텀 훅입니다.
 *
 * @template TData - 성공 시 반환되는 데이터 타입
 * @template TError - 에러 객체의 타입
 * @template TVariables - 뮤테이션에 전달되는 변수 타입
 * @template TContext - 옵티미스틱 업데이트 등에서 사용하는 컨텍스트 타입
 *
 * @param mutationFn - 서버에 데이터를 전송하는 비동기 함수
 * @param options - 뮤테이션 동작을 커스터마이징하기 위한 옵션
 * @returns React Query의 `useMutation` 훅 결과
 */

export function useCustomMutation<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFn: (variables: TVariables) => Promise<TData>,
    options: CustomMutationOptions<TData, TError, TVariables, TContext> = {},
) {
    const {showToast} = useToast()

    return useMutation({
        mutationFn,
        ...options,
        onError: (error, variables, context) => {
            const displayType = options.errorDisplayType ?? 'toast'

            if (options.onValidationError) {
                const mappedErrors = options.onValidationError(error)

                if (displayType === 'form' || displayType === 'both') {
                    if (options.setError) {
                        for (const {name, message} of mappedErrors) {
                            options.setError(name, {message})
                        }
                    }
                }

                if (displayType === 'toast' || displayType === 'both') {
                    for (const {message} of mappedErrors) {
                        showToast(message, {type: 'error'})
                    }
                }
            }

            if (options.onError) {
                options.onError(error, variables, context)
            }
        },
    })
}
