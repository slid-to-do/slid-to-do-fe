import type {
    GetApiParameters,
    PostApiParameters,
    PatchApiParameters,
    DeleteApiParameters,
    RequestParameters,
    ApiResponse,
    ApiPayload,
} from '@/types/api'

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

/** 통합된 HTTP 요청 함수 */

const request = async <T>({method, endpoint, data, options}: RequestParameters): Promise<ApiResponse<T>> => {
    const url = `${API_BASE_URL}/${endpoint}`
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
    })

    const status = response.status
    const payload = (await response.json()) as Partial<ApiPayload<T>>

    if (!response.ok) {
        const message = payload.message || `HTTP error! status: ${status}`
        throw new Error(message)
    }

    /** data가 null or undefined 이면 status 반환 */
    const apiResponse: ApiResponse<T> = {
        data: payload.data ?? (payload as unknown as T),
        status,
        message: payload.message,
    }
    return apiResponse
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

export const del = <T>({endpoint, options}: DeleteApiParameters): Promise<ApiResponse<T>> => {
    return request<T>({method: 'DELETE', endpoint, options})
}
