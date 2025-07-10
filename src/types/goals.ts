export interface GetGoalId {
    params: {
        goalId: string
    }
}

export interface Goal {
    id: number
    teamId: string
    userId: number
    title: string
    createdAt: string
    updatedAt: string
}

export interface GetGoalsResponse {
    goals: Goal[]
    totalCount: number
    nextCursor: number | undefined
}

export interface Todos {
    noteId: number
    done: boolean
    linkUrl: string
    fileUrl: string
    title: string
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
