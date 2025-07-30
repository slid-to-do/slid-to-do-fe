import type {Goal} from './goals'

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

export interface TodoListDetailResponse {
    totalCount: number
    nextCursor: number | null
    todos: TodoResponse[]
}

export interface FilterProperties {
    children: React.ReactNode
    checked?: boolean
    onChange?: (value: string) => void
    value: string
    name: string
}

export interface PostTodoRequest {
    title: string
    fileUrl?: string
    linkUrl?: string
    goalId: number | undefined
}

export interface PatchTodoRequest {
    title?: string
    done?: boolean
    goalId?: number
    linkUrl?: string
    fileUrl?: string
}
