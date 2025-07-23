import ProgressBar from '@/components/goals/prograss-motion'
import {get} from '@/lib/api'
import type {GoalProgress} from '@/types/goals'
import {useQuery} from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'

const GoalTitleHeader = ({goalId, title}: {goalId: number; title: string}) => {
    const {data: progressData} = useQuery<GoalProgress>({
        queryKey: ['todos', goalId, 'progress'],
        queryFn: async () => {
            const response = await get<GoalProgress>({
                endpoint: `1060/todos/progress?goalId=${goalId}`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })
            console.log(response.data)
            return response.data
        },
    })
    return (
        <header className="w-full h-auto p-2 ">
            <div className="w-full h-auto p-2 flex justify-between items-center">
                <h1 className="text-title-base font-semibold">{title}</h1>
                <Link
                    href={`/goals/${goalId}`}
                    className=" text-blue-500 text-subBody-sm font-bold w-auto h-auto cursor-pointer"
                >
                    +할일 추가
                </Link>
            </div>
            <ProgressBar progress={progressData?.progress ? progressData.progress : 0} />
        </header>
    )
}

export default GoalTitleHeader
