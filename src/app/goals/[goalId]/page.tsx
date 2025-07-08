'use client'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import {useInfiniteScroll} from '@/hooks/useInfiniteScroll'
import {get} from '@/lib/api'

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
    nextCursor: number | null
}

const TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDY5LCJ0ZWFtSWQiOiIxMDYwIiwiaWF0IjoxNzUxOTM0ODMyLCJleHAiOjE3NTIwMjEyMzIsImlzcyI6InNwLXNsaWR0b2RvIn0.bW8zR8cH9LZbJiSqyGlCEIW-vYcIB1ox92oJ-7Vax88`

async function fetchGoals(cursor: number) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const res = await get<{
        goals: Goal[]
        nextCursor: number | null
    }>({
        endpoint: `1060/goals?cursor=${cursor}&size=6&sortOrder=oldest`,
        options: {
            headers: {Authorization: `Bearer ${TOKEN}`},
        },
    })

    return {
        data: res.data.goals,
        nextCursor: res.data.nextCursor,
    }
}

async function fetchTodo(cursor: number) {
    const res = await get<{
        goals: Goal[]
        nextCursor: number | null
    }>({
        endpoint: `1060/goals?cursor=${cursor}&size=6&sortOrder=oldest`,
        options: {
            headers: {Authorization: `Bearer ${TOKEN}`},
        },
    })

    return {
        data: res.data.goals,
        nextCursor: res.data.nextCursor,
    }
}
export default function GoalsPage() {
    const {
        data: goals,
        ref: goalRef,
        isLoading: goalsLoading,
        hasMore: goalsHasMore,
    } = useInfiniteScroll<Goal>({fetchFn: fetchGoals})
    const {
        data: todos,
        ref: todoRef,
        isLoading: todosLoading,
        hasMore: todosHasMore,
    } = useInfiniteScroll<Goal>({fetchFn: fetchTodo})

    return (
        <div>
            <div className="flex gap-4">
                <div className={`flex-1/2 border border-violet-500 h-[500px] overflow-y-scroll rounded`}>
                    {goalsLoading && <LoadingSpinner />}

                    <div className="text-2xl mb-4">목표 List</div>
                    {goals.map((item) => (
                        <div key={`goal_${item.id}`} className="mb-20 flex gap-4 items-center">
                            <div>
                                {item.id} {item.title}
                            </div>
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-1"
                                disabled={goalsLoading}
                                onClick={() => alert('추가')}
                            >
                                Btn
                            </button>
                        </div>
                    ))}
                    {goalsHasMore && !goalsLoading ? (
                        <div ref={goalRef}></div>
                    ) : (
                        !goalsLoading && !goalsHasMore && <div>모든 데이터를 불러왔습니다.</div>
                    )}
                </div>
                <div className="flex-1/2 border border-blue-500 h-[500px] overflow-y-scroll rounded">
                    {todosLoading && <LoadingSpinner />}

                    <div className="text-2xl mb-4">할일 List</div>
                    {todos.map((item) => (
                        <div key={`todo_${item.id}`} className="mb-20 flex gap-4 items-center">
                            <div>
                                {item.id} {item.title}
                            </div>
                            <button
                                className="bg-blue-500 text-white rounded px-4 py-1"
                                disabled={todosLoading}
                                onClick={() => alert('추가')}
                            >
                                Btn
                            </button>
                        </div>
                    ))}
                    {todosHasMore && !todosLoading ? (
                        <div ref={todoRef}></div>
                    ) : (
                        !todosLoading && !todosHasMore && <div>모든 데이터를 불러왔습니다.</div>
                    )}
                </div>
            </div>
        </div>
    )
}
