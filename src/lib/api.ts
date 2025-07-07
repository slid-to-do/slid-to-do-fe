import type {
    GetApiParams,
    PostApiParams,
    PatchApiParams,
    DeleteApiParams,
    RequestParams,
    ApiResponse,
} from '@/types/api'

/* 사용법
import { get, post, patch, del } from '@/lib/api'

// ex) get
const response = await get<타입>({ endpoint: 'url' })
const todos = response.data

// ex) post / patch
const response = await post<타입>({ 
    endpoint: 'url', 
    data: {  } 
})
const newTodo = response.data

// ex) delete
const response = await del({ endpoint: 'url' })
*/

// 통합된 HTTP 요청 함수
async function request<T>({method, endpoint, data, options}: RequestParams): Promise<ApiResponse<T>> {
    //const url = `${BASE_URL}/${endpoint}`
    const url = `/${endpoint}`
    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        body: data ? JSON.stringify(data) : undefined,
        ...options,
    })

    const status = response.status
    const payload = await response.json().catch(() => ({}))

    if (!response.ok) {
        const message = (payload as any).message || `HTTP error! status: ${status}`
        throw new Error(message)
    }

    // data가 null or undefined 이면 status 반환
    const apiResponse: ApiResponse<T> = {
        data: (payload as any).data ?? (payload as T),
        status,
        message: (payload as any).message,
    }
    return apiResponse
}

// HTTP 메서드별 함수
export function get<T>({endpoint, options}: GetApiParams): Promise<ApiResponse<T>> {
    return request<T>({method: 'GET', endpoint, options})
}

export function post<T>({endpoint, data, options}: PostApiParams): Promise<ApiResponse<T>> {
    return request<T>({method: 'POST', endpoint, data, options})
}

export function patch<T>({endpoint, data, options}: PatchApiParams): Promise<ApiResponse<T>> {
    return request<T>({method: 'PATCH', endpoint, data, options})
}

export function del<T>({endpoint, options}: DeleteApiParams): Promise<ApiResponse<T>> {
    return request<T>({method: 'DELETE', endpoint, options})
}
