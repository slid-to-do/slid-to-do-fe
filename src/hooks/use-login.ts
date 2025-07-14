'use client'

import {useState} from 'react'
import {post} from '@/lib/api'
import type {LoginResponse} from '@/types/login'

interface UseLoginParams {
    email: string
    password: string
}

export function useLogin() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const login = async ({email, password}: UseLoginParams) => {
        setLoading(true)
        setError(null)

        try {
            const res = await post<LoginResponse>({
                endpoint: 'auth/login',
                data: {email, password},
            })

            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)

            return res.data
        } catch (err: any) {
            setError(err.message || '로그인 중 오류 발생')
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {login, loading, error}
}
