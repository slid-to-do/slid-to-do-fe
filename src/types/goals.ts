export interface Goal {
    id: number
    title: string
}

/**단일 목표 응답 */
export interface GoalReponse extends Goal {
    linkUrl: string
    content: string
    teamId: string
    userId: number
    createdAt: string
    updatedAt: string
}

export interface GetGoalId {
    params: {
        goalId: string
    }
}

export interface GetGoalsResponse {
    goals: Goal[]
    totalCount: number
    nextCursor: number | undefined
}
