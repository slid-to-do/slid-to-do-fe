export interface ApiResponse<T> {
    data: T
    status: number
    message?: string
}

export interface ApiError {
    message: string
    status: number
    code?: string
}

export interface ApiPayload<T> {
    status: number
    data?: T
    message?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface RequestParams {
    method: HttpMethod
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface GetApiParams {
    endpoint: string
    options?: RequestInit
}

export interface PostApiParams {
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface PatchApiParams {
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface DeleteApiParams {
    endpoint: string
    options?: RequestInit
}
