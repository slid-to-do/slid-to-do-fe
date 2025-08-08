'use client'

import Image from 'next/image'
import {useSearchParams} from 'next/navigation'

import LoadingSpinner from '@/components/common/loading-spinner'
import {useCustomQuery} from '@/hooks/use-custom-query'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/common-api'
import {noteListApi} from '@/lib/notes/api'

import {NoteList} from '../../components/notes/list'

import type {ApiError} from '@/types/api'
import type {InfiniteScrollOptions} from '@/types/infinite-scroll'
import type {NoteCommon} from '@/types/notes'

const Page = () => {
    const parameters = useSearchParams()
    const goalId = parameters.get('goalId')

    const {
        data: notes,
        isLoading,
        ref,
        hasMore,
    } = useInfiniteScrollQuery({
        queryKey: ['notes'],
        fetchFn: (cursor) => noteListApi(goalId ?? undefined, cursor),
        enabled: goalId !== null,
    } as InfiniteScrollOptions<NoteCommon>)

    const fetchGetGoalTitle = async (): Promise<{title: string}> => {
        const fallbackEndpoint = `goals/${goalId}`
        const fallbackResult = await get<{title: string}>({
            endpoint: fallbackEndpoint,
        })

        return fallbackResult.data
    }

    const {data: goalData, isLoading: isGoalLoading} = useCustomQuery(['goalTitle', goalId], fetchGetGoalTitle, {
        enabled: !!goalId && notes.length === 0,
        errorDisplayType: 'toast',
        mapErrorMessage: (error) => {
            const apiError = error as ApiError
            return apiError.message || '알 수 없는 오류가 발생했습니다.'
        },
    })
    if (isLoading || isGoalLoading) {
        return <LoadingSpinner />
    }

    hasMore && !isLoading && notes.length > 0 && <div ref={ref} />

    return (
        <div className="bg-slate-100 flex flex-col w-full min-h-screen h-full overflow-y-auto">
            <div className="desktop-layout min-h-screen flex flex-col">
                <header>
                    <h1 className="text-subTitle text-custom_slate-900 ">노트 모아보기</h1>
                </header>

                <div className="w-full mt-4 flex-1 flex flex-col">
                    <div className="flex gap-2 items-center bg-white rounded-xl border border-custom_slate-100 py-3.5 px-6">
                        <Image src="/goals/flag-goal.svg" alt="목표깃발" width={28} height={28} />
                        <h2 className="text-subTitle-sm">
                            {' '}
                            {notes.length > 0 ? notes?.[0]?.goal.title : goalData?.title}
                        </h2>
                    </div>

                    {notes.length > 0 ? (
                        <>
                            <NoteList notesData={notes} />
                            {!hasMore && notes.length > 0 && (
                                <div className="mt-4 text-gray-400 text-sm flex items-center justify-center">
                                    <p>모든 노트를 다 불러왔어요</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-full  flex-1 flex items-center justify-center">
                            <p className="text-sm font-normal text-custom_slate-500">아직 등록된 노트가 없어요</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page
