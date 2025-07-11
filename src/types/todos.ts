export interface Todo {
    id: number
    title: string
    done: boolean
    linkUrl?: string
    fileUrl?: string
}

/**할일 리스트 조회 응답 */
export interface TodoReponse extends Todo {
    noteId: number
    id: number
    goal: GetTodoGoal
    userId: number
    teamId: string
    updatedAt: Date
    createdAt: Date
}

export interface GetTodoGoal {
    title: string
    id: number
}
