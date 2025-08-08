import {del, get, patch} from '@/lib/api'

import type {Goal, GoalProgress} from '@/types/goals'
import type {TodoResponse} from '@/types/todos'

// goal API 호출 함수
export const goalDataApi = async (goalId: string): Promise<Goal> => {
    const endpoint = `goals/${goalId}`
    const response = await get<Goal>({
        endpoint,
    })

    return response.data
}

// goal update API 함수
export const goalUpdateApi = async (goalId: string, goalTitle: string): Promise<TodoResponse> => {
    const response = await patch<TodoResponse>({
        endpoint: `goals/${goalId}`,
        data: {title: goalTitle},
        options: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
            },
        },
    })

    return response.data
}

// goal delete API 함수
export const goalDeleteApi = async (goalId: string): Promise<void> => {
    await del({
        endpoint: `goals/${goalId}`,
    })
}

// goal prograss API 함수
export const goalPrograssApi = async (goalId: number): Promise<GoalProgress> => {
    const response = await get<GoalProgress>({
        endpoint: `todos/progress?goalId=${goalId}`,
    })
    return response.data
}
