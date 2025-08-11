'use client'

import Link from 'next/link'
import React from 'react'

import AddTodoModal from '@/components/common/modal/add-todo-modal'
import ProgressBar from '@/components/goals/prograss-motion'
import {useCustomQuery} from '@/hooks/use-custom-query'
import {useModal} from '@/hooks/use-modal'
import {get} from '@/lib/common-api'

import type {GoalProgress} from '@/types/goals'

const GoalTitleHeader = ({goalId, title}: {goalId: number; title: string}) => {
    const {openModal} = useModal(<AddTodoModal />)
    const {data: progressData} = useCustomQuery<number>(['todos', goalId, 'dashProgress'], async () => {
        const response = await get<GoalProgress>({
            endpoint: `todos/progress?goalId=${goalId}`,
        })

        return response.data.progress
    })

    return (
        <header className="w-full h-auto p-2 ">
            <div className="w-full h-auto p-2 flex justify-between items-center min-w-0">
                <Link
                    href={`/goals/${goalId}`}
                    className="flex-1 min-w-0 text-title-base font-semibold cursor-pointer truncate"
                >
                    {title}
                </Link>

                <button
                    onClick={openModal}
                    className="whitespace-nowrap shrink-0 text-blue-500 text-subBody-sm font-bold w-auto h-auto cursor-pointer"
                >
                    +할일 추가
                </button>
            </div>
            <ProgressBar progress={progressData || 0} />
        </header>
    )
}

export default GoalTitleHeader
