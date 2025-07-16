'use client'

import {useState} from 'react'

import {post} from '@/lib/api'

import type {ApiError} from '@/types/api'
import type {SignupFormData} from '@/types/signup'

export function useSignup() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const signup = async (data: SignupFormData) => {
        setLoading(true)
        setError('')
        try {
            const response = await post({
                endpoint: 'user',
                data,
            })
            return response.data
        } catch (error_: unknown) {
            const api_error = error_ as ApiError
            setError(api_error.message || '회원가입 중 오류가 발생했습니다.')
            throw api_error
        } finally {
            setLoading(false)
        }
    }

    return {signup, loading, error}
}
