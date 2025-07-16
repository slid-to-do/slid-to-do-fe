import type {Goal} from './goals'

import {Goal} from './goal'

export interface Todo {
    id: number
    title: string
    done: boolean
    linkUrl?: string
    fileUrl?: string
}

/**할일 리스트 조회 응답 */
export interface TodoResponse extends Todo {
    noteId: number
    goal: Goal
    userId: number
    teamId: string
    updatedAt: string
    createdAt: string
}
