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

export interface RequestParameters {
    method: HttpMethod
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface GetApiParameters {
    endpoint: string
    options?: RequestInit
}

export interface PostApiParameters {
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface PatchApiParameters {
    endpoint: string
    data?: object
    options?: RequestInit
}

export interface DeleteApiParameters {
    endpoint: string
    options?: RequestInit
}
