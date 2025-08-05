'use client'

import {useMutation} from '@tanstack/react-query'

import useToast from '@/hooks/use-toast'

import type {UseMutationOptions} from '@tanstack/react-query'
import type {FieldValues, UseFormSetError} from 'react-hook-form'

type ErrorDisplayType = 'toast' | 'form' | 'both' | 'none'

type CustomMutationOptions<TData, TError, TVariables, TContext> = UseMutationOptions<
    TData,
    TError,
    TVariables,
    TContext
> & {
    setError?: UseFormSetError<FieldValues>
    onValidationError?: (error: TError) => {name: string; message: string}[]
    errorDisplayType?: ErrorDisplayType
    mapErrorMessage?: (error: TError) => string
}

const handleMappedErrors = <TData, TError, TVariables, TContext>(
    error: TError,
    options: CustomMutationOptions<TData, TError, TVariables, TContext>,
    showToast: ReturnType<typeof useToast>['showToast'],
) => {
    const mappedErrors = options.onValidationError?.(error)
    if (!mappedErrors?.length) return

    const displayType = options.errorDisplayType ?? 'toast'
    const isForm = displayType === 'form' || displayType === 'both'
    const isToast = displayType === 'toast' || displayType === 'both'

    if (isForm && options.setError) {
        for (const {name, message} of mappedErrors) {
            if (name) options.setError(name, {message})
        }
    }

    if (isToast) {
        for (const {message} of mappedErrors) {
            showToast(message, {type: 'error', id: 'MUTATION_TOAST_ID'})
        }
    }
}


const handleServerError = <TError>(error: TError, showToast: ReturnType<typeof useToast>['showToast']) => {
    if (typeof (error as {status?: number}).status === 'number' && (error as {status?: number}).status! >= 500) {
        showToast('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', {
            type: 'error',
            id: 'SERVER_ERROR_TOAST_ID',
        })
    }
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
 * @param mutationFunction - 서버에 데이터를 전송하는 비동기 함수
 * @param options - 뮤테이션 동작을 커스터마이징하기 위한 옵션
 * @returns React Query의 `useMutation` 훅 결과
 */

export const useCustomMutation = <TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    mutationFunction: (variables: TVariables) => Promise<TData>,
    options: CustomMutationOptions<TData, TError, TVariables, TContext> = {},
) => {
    const {showToast} = useToast()

    return useMutation({
        mutationFn: mutationFunction,
        ...options,
        onError: (error, variables, context) => {
            const displayType = options.errorDisplayType ?? 'toast'

            handleMappedErrors(error, options, showToast)

            const mapped = options.mapErrorMessage?.(error)
            if (displayType === 'toast' && mapped) {
                showToast(mapped, {type: 'error'})
            }

            handleServerError(error, showToast)

            options.onError?.(error, variables, context)
        },
    })
}
