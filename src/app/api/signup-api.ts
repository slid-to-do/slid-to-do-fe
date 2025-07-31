import {post} from '@/lib/api'

import type {SignupFormData} from '@/types/signup'

/**
 * 회원가입 API 요청 함수
 * @param data - 회원가입 폼 데이터
 * @returns void (응답 데이터는 사용하지 않음)
 */
export async function signupApi(data: SignupFormData): Promise<void> {
    await post({
        endpoint: 'user',
        data,
    })
}
