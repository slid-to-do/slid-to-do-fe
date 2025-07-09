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
