import axios from 'axios'

import type {SignupFormData} from '@/types/signup'

/**
 * 회원가입 API 요청 함수
 * @param data - 회원가입 폼 데이터
 * @returns void (응답 데이터는 사용하지 않음)
 */

const URL = process.env.NEXT_PUBLIC_BACKEND_API
export const signupApi = async (data: SignupFormData): Promise<void> => {
    const interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.data?.message) {
                error.message = error.response.data.message
            } else if (error.response?.data?.error) {
                error.message = error.response.data.error
            }
            return Promise.reject(error)
        },
    )

    try {
        await axios.post(`${URL}/user`, {
            headers: {
                'Content-Type': 'application/json',
            },
            email: data.email,
            name: data.name,
            password: data.password,
        })
    } finally {
        axios.interceptors.response.eject(interceptor)
    }
}
