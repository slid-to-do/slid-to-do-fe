'use client'

import Image from 'next/image'
import {useSearchParams} from 'next/navigation'

import LoadingSpinner from '@/components/common/loading-spinner'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'

import {NoteList} from '../../components/notes/list'

import type {InfiniteScrollOptions} from '@/types/infinite-scroll'
import type {NoteCommon, NoteListResponse} from '@/types/notes'

const Page = () => {
    const parameters = useSearchParams()
    const goalId = parameters.get('goalId')

    const fetchNoteList = async (cursor?: number) => {
        const urlParameter = new URLSearchParams()
        urlParameter.set('size', '10')
        if (goalId) urlParameter.set('goalId', goalId)
        if (cursor !== undefined) urlParameter.set('cursor', String(cursor))

        const endpoint = `/notes?${urlParameter.toString()}`
        const result = await get<NoteListResponse>({
            endpoint: endpoint,
            options: {
                headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
            },
        })
        return {
            data: result.data.notes,
            nextCursor: result.data.nextCursor,
        }
    }

    const {
        data: notes,
        ref,
        hasMore,
        isLoading,
        isError,
        error,
    } = useInfiniteScrollQuery({
        queryKey: ['notes'],
        fetchFn: fetchNoteList,
        enabled: goalId !== null,
    } as InfiniteScrollOptions<NoteCommon>)

    if (isLoading) return <LoadingSpinner />
    if (isError && error) throw error
    hasMore && !isLoading && notes.length > 0 && <div ref={ref} />

    return (
        <div className="bg-slate-100 flex flex-col w-full min-h-screen h-full overflow-y-auto p-6 desktop:px-20 ">
            <header>
                <h1 className="text-subTitle text-custom_slate-900 ">노트 모아보기</h1>
            </header>

            <div className="w-full mt-4 flex-1 flex flex-col">
                <div className="flex gap-2 items-center bg-white rounded-xl border border-custom_slate-100 py-3.5 px-6">
                    <Image src="/goals/flag-goal.png" alt="목표깃발" width={28} height={28} />
                    <h2 className="text-subTitle-sm">{notes?.[0]?.goal.title}</h2>
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
    )
}

export default Page
