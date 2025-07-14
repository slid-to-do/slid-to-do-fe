'use client'

import {useState} from 'react'

import {post} from '@/lib/api'

import type {ApiError} from '@/types/api'
import type {LoginResponse} from '@/types/login'
import type {LoginFormData} from '@/types/login'

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const login = async ({email, password}: LoginFormData) => {
        setLoading(true)
        setError('')

        try {
            const response = await post<LoginResponse>({
                endpoint: 'auth/login',
                data: {email, password},
            })

            localStorage.setItem('accessToken', response.data.accessToken)
            localStorage.setItem('refreshToken', response.data.refreshToken)

            return response.data
        } catch (error_: unknown) {
            const api_error = error_ as ApiError
            setError(api_error.message || '로그인 중 오류 발생')
            throw api_error
        } finally {
            setLoading(false)
        }
    }

    return {login, loading, error}
}
