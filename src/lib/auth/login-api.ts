import axios from 'axios'

import type {LoginFormData} from '@/types/login'

/**
 * 로그인 API 호출 함수
 *
 * 사용자의 이메일과 비밀번호를 서버에 전송하여 로그인을 시도하고,
 * 응답으로 받은 accessToken과 refreshToken을 localStorage에 저장합니다.
 *
 * @param {LoginFormData} data - 로그인 요청에 필요한 사용자 입력 데이터 (이메일, 비밀번호)
 * @returns {Promise<void>} 반환값은 없으며, 성공 시 토큰을 저장하고 실패 시 예외를 던집니다.
 */
export const loginApi = async (data: LoginFormData): Promise<void> => {
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
        await axios.post('/api/auth/login', {
            email: data.email,
            password: data.password,
        })
    } finally {
        axios.interceptors.response.eject(interceptor)
    }
}
