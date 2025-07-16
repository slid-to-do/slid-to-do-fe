'use client'
import Image from 'next/image'

import LoadingSpinner from '@/components/common/loading-spinner'

import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import {get} from '@/lib/api'
import {NoteList} from '../../components/notes/list'
import type {NoteCommon, NoteListResponse} from '@/types/notes'

/**import React, {useEffect} from 'react'*/
/**import type {LoginResponse} from '@/types/login'*/

export const Page = async ({searchParams}: {searchParams: Promise<{goalId?: string}>}) => {
    const goalId = (await searchParams).goalId
    /**const fetchLogin = async () => {
        const response = await post<LoginResponse>({
            endpoint: 'auth/login',
            data: {
                email: 'email@nate.com',
                password: 'string123',
            },
        })
        console.log('loginRes', response)
        localStorage.setItem('token', response.data.refreshToken)
    }*/

    /** useEffect(() => {
      fetchLogin()
    }, [])*/

    // const fetchNoteList = async (cursor?: number) => {
    //     let endpoint = `notes?size=10?goalId=${goalId}`
    //     if (cursor !== undefined) endpoint += `&cursor=${cursor}`
    //     const result = await get<NoteListResponse>({
    //         endpoint: endpoint,
    //         options: {
    //             headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
    //         },
    //     })
    //     return {
    //         data: result.data.notes,
    //         nextCursor: result.data.nextCursor,
    //     }
    // }

    // const {
    //     data: notes,
    //     ref,
    //     hasMore,
    //     isLoading,
    //     isError,
    // } = useInfiniteScrollQuery<NoteCommon>({
    //     queryKey: ['notes'],
    //     fetchFn: fetchNoteList,
    // })

    // if (isLoading) return <LoadingSpinner />
    // if (isError || !notes) return <p>에러가 발생했습니다.</p>
    // hasMore && !isLoading && notes.length > 0 && <div ref={ref} />

    return (
        <div className="bg-slate-100 flex flex-col min-h-screen pt-6 pr-6 pb-6 mobile:pl-6 tablet:pl-6 pl-20 ">
            <header className=" ">
                <h1 className="text-subTitle text-custom_slate-900 ">노트 모아보기</h1>
            </header>

            <div className="max-w-[792px] mt-4 flex-1 flex flex-col">
                {/* {notes.length > 0 && (
                    <div className="flex gap-2 items-center bg-white rounded-xl border border-custom_slate-100 py-3.5 px-6">
                        <Image src="/goals/flag-goal.png" alt="목표깃발" width={28} height={28} />
                        <h2 className="text-subTitle-sm">{notes?.[0]?.goal.title}</h2>
                    </div>
                )}

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
                )} */}
            </div>
        </div>
    )
}

export default Page
