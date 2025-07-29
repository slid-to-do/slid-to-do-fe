import {post} from '@/lib/api'

import type {SignupFormData} from '@/types/signup'

// sign-up-api.ts
export async function signUpApi(data: SignupFormData) {
    const response = await post({
        endpoint: 'user',
        data,
    })
    return response.data
}
