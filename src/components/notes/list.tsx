'use client'

import Image from 'next/image'

/**import {post} from '@/lib/api'*/
import type {NoteCommon} from '@/types/notes'

import {useModal} from '@/hooks/use-modal'
import NotesSelect from '@/components/notes/select'


import SideModal from '../common/modal/side-modal'
/**import {useEffect} from 'react'*/
export const NoteList = ({notesData}: {notesData: NoteCommon[]}) => {
    const {openModal} = useModal((noteId: number) => <SideModal noteId={noteId} />, {
        modalAnimation: 'slideFromRight',
    })

    // const fetchData = async () => {
    //     const response = await post<NoteCommon[]>({
    //         endpoint: 'notes',
    //         options: {
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem('token')}`,
    //             },
    //         },
    //         data: {
    //             todoId: 5138,
    //             title: '노트 테스트 37 테스트입니다',
    //             content:
    //                 '노트 테스트 37 테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트테스트입니다노트',
    //         },
    //     })
    //     console.log('response', response)
    // }

    /*노트 제목 클릭 시 사이드 모달 오픈* */
    const openNoteDetail = (noteId: number) => {
        openModal(noteId)
    }

    return (
        <div className="mt-4 w-full h-full flex-1">
            {/* <button onClick={fetchData}>테스트 노트추가</button> */}
            {notesData.map((note) => (
                <div key={note.id} className="mt-4 bg-white rounded-xl border border-custom_slate-100 p-6">
                    <div className="flex justify-between ">
                        <div className="">
                            <Image src="/notes/note-list.svg" alt="icon" width={28} height={28} />
                        </div>
                        <NotesSelect noteId={note.id} />
                    </div>

                    <div className="bg-white rounded-xl  ">
                        <div className="border-b-1 border-custom_slate-200 pt-4 pb-3 ">
                            <span
                                onClick={() => openNoteDetail(note.id)}
                                className="text-subTitle font-medium cursor-pointer"
                            >
                                {note.title}
                            </span>
                        </div>

                        <div className="pt-3 flex items-center gap-2">
                            <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                                To do
                            </div>
                            <p className=" text-custom_slate-700 text-subBody font-normal"> {note.todo.title}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default NoteList
