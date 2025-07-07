// API 응답 인터페이스
export interface ApiResponse<T = any> {
    data: T
    status: number
    message?: string
}

// API 에러 인터페이스
export interface ApiError {
    message: string
    status: number
    code?: string
}

// HTTP 메서드 타입
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

// 통합된 request 함수를 위한 매개변수 인터페이스
export interface RequestParams {
    method: HttpMethod
    endpoint: string
    data?: object
    options?: RequestInit
}

// API 함수 매개변수 인터페이스들
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
