'use client'

import Image from 'next/image'

import axios from 'axios'

import {dateformat} from '@/components/style/utils'
import {useCustomQuery} from '@/hooks/use-custom-query'
import {noteDetailApi} from '@/lib/notes/api'
import {useModalStore} from '@/store/use-modal-store'

import LoadingSpinner from '../loading-spinner'

import type {NoteItemResponse} from '@/types/notes'

const SideModal = ({noteId}: {noteId: number}) => {
    const {data, isLoading} = useCustomQuery<NoteItemResponse>(['noteDetail', noteId], () => noteDetailApi(noteId), {
        errorDisplayType: 'toast',
        mapErrorMessage: (error_) => {
            if (axios.isAxiosError(error_)) {
                return error_.response?.data.message || '서버 오류가 발생했습니다.'
            }
            return '할 일 상세 정보를 불러오는 데 실패했습니다.'
        },
    })

    const {clearModal} = useModalStore()

    return (
        <div className="absolute inset-y-0 right-0 z-50 bg-white lg:w-[800px] sm:w-lg w-full p-6">
            <Image
                src="/todos/ic-close.svg"
                alt="Close Icon"
                width={24}
                height={24}
                onClick={clearModal}
                className="mb-4 cursor-pointer"
            />

            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="flex items-center gap-1.5 mb-3 text-base font-medium text-custom_slate-800">
                        <Image src="/todos/ic-flag.svg" alt="Flag Icon" width={24} height={24} />
                        <div>{data?.goal.title}</div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="text-xs font-medium text-custom_slate-700 bg-custom_slate-100 py-[1px] px-[3px] rounded-sm">
                                To do
                            </div>
                            <div className="text-sm text-custom_slate-700">{data?.todo.title}</div>
                        </div>
                        <div className="text-xs text-custom_slate-500">{dateformat(data?.createdAt)}</div>
                    </div>

                    <h2 className="py-3 mb-3 text-lg font-medium border-t border-b border-custom_slate-200 text-custom_slate-800">
                        {data?.title}
                    </h2>

                    {data?.linkUrl && (
                        <div className="my-4 bg-custom_slate-200 p-1 rounded-full flex justify-between items-center">
                            <div className="flex items-end gap-2">
                                <Image src="/markdown-editor/ic-save-link.svg" alt="링크이동" width={24} height={24} />
                                <a href={data?.linkUrl} target="_blank" className="inline-block" rel="noreferrer">
                                    {data?.linkUrl}
                                </a>
                            </div>
                        </div>
                    )}

                    <p
                        className="text-custom_slate-700 prose break-words"
                        dangerouslySetInnerHTML={{__html: data?.content || ''}}
                    />
                </>
            )}
        </div>
    )
}

export default SideModal
