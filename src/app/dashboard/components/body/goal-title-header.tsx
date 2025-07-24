'use client'

import Link from 'next/link'
import React from 'react'

import {useQuery} from '@tanstack/react-query'

import ProgressBar from '@/components/goals/prograss-motion'
import {get} from '@/lib/api'

import type {GoalProgress} from '@/types/goals'

const GoalTitleHeader = ({goalId, title}: {goalId: number; title: string}) => {
    const {data: progressData} = useQuery<number>({
        queryKey: ['todos', goalId, 'progress'],
        queryFn: async () => {
            const response = await get<GoalProgress>({
                endpoint: `todos/progress?goalId=${goalId}`,
                options: {
                    headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                },
            })

            return response.data.progress
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
            <ProgressBar progress={progressData || 0} />
        </header>
    )
}

export default GoalTitleHeader
