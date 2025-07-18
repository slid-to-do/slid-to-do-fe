import axios from 'axios'

import type {
    GetApiParameters,
    PostApiParameters,
    PatchApiParameters,
    DeleteApiParameters,
    RequestParameters,
    ApiResponse,
    ApiPayload,
} from '@/types/api'
import type {AxiosRequestConfig} from 'axios'

/** 사용법
import { get, post, patch, del } from '@/lib/api'

ex) get
const response = await get<타입>({ endpoint: 'url' })
const todos = response.data

ex) post / patch
const response = await post<타입>({ 
    endpoint: 'url', 
    data: {  } 
})
const newTodo = response.data

ex) delete
const response = await del({ endpoint: 'url' })
*/

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/** axios 인스턴스 생성 */
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/** 통합된 HTTP 요청 함수 - axios 버전 */
const request = async <T>({method, endpoint, data, options}: RequestParameters): Promise<ApiResponse<T>> => {
    try {
        const config: AxiosRequestConfig = {
            url: endpoint,
            method,
            data,
            headers: options?.headers,
        }

        const response = await axiosInstance.request<ApiPayload<T>>(config)

        return {
            data: response.data.data ?? (response.data as unknown as T),
            status: response.status,
            message: response.data.message,
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status ?? 500
            const message = error.response?.data?.message || error.message || '에러 발생'
            const customError = new Error(message) as Error & {status: number}
            customError.status = status
            throw customError
        }

        throw error
    }
}

/** HTTP 메서드별 함수 */
export const get = <T>({endpoint, options}: GetApiParameters): Promise<ApiResponse<T>> => {
    return request<T>({method: 'GET', endpoint, options})
}

export const post = <T>({endpoint, data, options}: PostApiParameters): Promise<ApiResponse<T>> => {
    return request<T>({method: 'POST', endpoint, data, options})
}

export const patch = <T>({endpoint, data, options}: PatchApiParameters): Promise<ApiResponse<T>> => {
    return request<T>({method: 'PATCH', endpoint, data, options})
}

export const del = async ({endpoint, options}: DeleteApiParameters): Promise<void> => {
    await request<void>({method: 'DELETE', endpoint, options})
}
