'use client'

import Image from 'next/image'
import React, {useState} from 'react'

import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {useModal} from '@/hooks/use-modal'
import LoadingSpinner from '@/components/common/loading-spinner'

import ButtonStyle from '../../style/button-style'
import GoalModal from './goal-modal'
import {get} from '@/lib/api'

import type {Goal, GoalResponse} from '@/types/goals'
import Link from 'next/link'

const GoalList = ({isMobile}: {isMobile: boolean | 'noState'}) => {
    const {openModal} = useModal(<GoalModal />)
    const [goalData, setGoalData] = useState<GoalResponse>()
    const [cursornextCursor, setNextCursor] = useState<number | undefined>(0)

    const getGoalsData = () => {
        return async (cursor: number | undefined) => {
            try {
                const urlParam = cursor === undefined ? '' : `&cursor=${cursor}`
                const response = await get<{goals: GoalResponse[]; nextCursor: number | undefined}>({
                    endpoint: `goals?size=20&sortOrder=newest${urlParam}`,
                    options: {
                        headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                    },
                })
                setNextCursor(response.data.nextCursor)

                return {
                    data: response.data.goals,
                    nextCursor: response.data.nextCursor,
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error
                }
                throw new Error(String(error))
            }
        }
    }
    const {
        data: goals,
        ref: doneReference,
        isLoading: loadingDone,
        hasMore: haseMoreDone,
    } = useInfiniteScrollQuery<GoalResponse>({
        queryKey: ['goals'],
        fetchFn: getGoalsData(),
    })

    return (
        <section
            aria-labelledby="goals-heading"
            className=" border-[#E2E8F0] h-full grow flex flex-col mt-4  flex-1 min-h-0"
        >
            <div className="flex flex-col h-full min-h-0 flex-1 mb-3 ">
                <div className="flex  pl-2 gap-3 h-6">
                    <Image src={'./sidebar/flag.svg'} alt="flag" width={13} height={15} />
                    <h2 id="goals-heading" className=" text-left w-full   text-subTitle-base   text-custom_slate-700">
                        목표
                    </h2>

                    {isMobile && (
                        <ButtonStyle onClick={openModal} type="button" size="small" color="outline">
                            + 새 목표
                        </ButtonStyle>
                    )}
                </div>

                <div className="p-4   space-y-4 flex-nowrap overflow-y-auto overflow-scroll  flex-1 min-h-0">
                    {goals.length > 0 ? (
                        <>
                            {loadingDone ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {goals.map((goal: Goal) => (
                                        <Link
                                            href={`goals/${goal.id}`}
                                            className=" flex h-[23px]  items-center whitespace-nowrap cursor-pointer group  overflow-hidden "
                                            key={goal.id}
                                        >
                                            <span className=" text-custom_slate-700 text-body mr-1 group-hover:opacity-70">
                                                ・
                                            </span>
                                            <span className="text-custom_slate-700 text-body-sm tracking-tight truncate group-hover:opacity-70">
                                                {goal.title}
                                            </span>
                                        </Link>
                                    ))}

                                    {haseMoreDone && !loadingDone && goals.length > 0 && <div ref={doneReference} />}

                                    {!haseMoreDone && goals.length > 0 && (
                                        <div className="mt-4 text-gray-400 text-sm">모든 할일을 다 불러왔어요</div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="flex items-center justify-center text-sm text-custom_slate-500 text-center h-[120px]">
                            해야할 일이 아직 없어요
                        </div>
                    )}
                </div>
            </div>
            {!isMobile && (
                <ButtonStyle type="button" onClick={openModal} size="full" color="outline">
                    + 새 목표
                </ButtonStyle>
            )}
        </section>
    )
}

export default GoalList
