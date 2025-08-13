import {del, get, patch} from '@/lib/common-api'

import type {Todo, TodoResponse} from '@/types/todos'

// 할일 API 호출 함수
export const todoDataApi = async (todoId: number): Promise<Todo> => {
    const endpoint = `todos/${todoId}`
    const response = await get<Todo>({
        endpoint,
    })

    return response.data
}

// 할일 update API 함수
export const todoUpdateApi = async (todoId: number, newDone: boolean): Promise<TodoResponse> => {
    const response = await patch<TodoResponse>({
        endpoint: `todos/${todoId}`,
        data: {done: newDone},
    })

    return response.data
}

// 할일 delete API 함수
export const todoDeleteApi = async (todoId: number): Promise<void> => {
    const response = await del({
        endpoint: `todos/${todoId}`,
    })
    return response
}
