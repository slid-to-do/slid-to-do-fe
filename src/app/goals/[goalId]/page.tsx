import {get} from '@/lib/api'
import type {GetGoalId, Goal} from '@/types/goals'
import GoalsDetaieView from './detail'

export default async function GoalsDetailPage({params}: GetGoalId) {
    const url = `/1060/goals/${params.goalId}`
    console.log(url)
    const TOKEN = process.env.NEXT_PUBLIC_TEST_TOKEN

    try {
        const response = await get<Goal>({
            endpoint: `${url}`,
            options: {
                headers: {Authorization: `Bearer ${TOKEN}`},
            },
        })
        const goal = response.data
        return <GoalsDetaieView goal={goal} />
    } catch (error: unknown) {
        if (error instanceof Error) {
            return <div>{error.message}</div>
        }
        return <div>{String(error)}</div>
    }
}
