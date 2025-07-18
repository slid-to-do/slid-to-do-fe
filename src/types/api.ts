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

interface RequestOptions {
    headers?: Record<string, string>
}

export interface RequestParameters {
    method: HttpMethod
    endpoint: string
    data?: unknown
    options?: RequestOptions
}

export type GetApiParameters = Omit<RequestParameters, 'method' | 'data'> & {
    method?: 'GET'
}

export type PostApiParameters = Omit<RequestParameters, 'method'> & {
    method?: 'POST'
}

export type PatchApiParameters = Omit<RequestParameters, 'method'> & {
    method?: 'PATCH'
}

export type DeleteApiParameters = Omit<RequestParameters, 'method' | 'data'> & {
    method?: 'DELETE'
}
