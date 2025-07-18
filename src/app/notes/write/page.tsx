'use client'

import Image from 'next/image'
import {useSearchParams} from 'next/navigation'
import {useCallback, useEffect, useState} from 'react'

import NoteEditCompo from '@/components/notes/edit'
import NoteWriteCompo from '@/components/notes/write'
import ButtonStyle from '@/components/style/button-style'

const NoteWritePage = () => {
    const searchParameters = useSearchParams()
    const goalId = searchParameters.get('goalId')
    const todoId = searchParameters.get('todoId')
    const noteId = searchParameters.get('noteId')

    const [toast, setToast] = useState<boolean>(false)
    const [content, setContent] = useState<string>('')
    const [subject, setSubject] = useState<string>('')

    const isEdit = typeof noteId === 'string'

    useEffect(() => {
        if (todoId === undefined || goalId === undefined) {
            alert('확인 할 데이터가 없습니다.') // 에러페이지로 이동
        } else {
            if (noteId === null && localStorage.getItem(`note-draft-${goalId}-${todoId}`) !== null) {
                setToast(true)
            }
        }
    }, [todoId, goalId, noteId])

    /**임시저장 */
    const saveToLocalStorage = useCallback(
        (editContent: string) => {
            if ((content === '<p></p>' || content === '') && subject === '') {
                alert('제목 또는 내용을 입력해주세요.')
            }
            const key = `note-draft-${goalId}-${todoId}`
            const value = JSON.stringify({
                goalId,
                todoId,
                editContent,
                editSubject: subject,
            })
            localStorage.setItem(key, value)
        },
        [goalId, todoId, subject, content],
    )

    useEffect(() => {
        if (!goalId || !todoId) return
        if ((content === '<p></p>' || content === '') && subject === '') return
        const interval = setInterval(
            () => {
                saveToLocalStorage(content)
            },
            1 * 60 * 1000,
        )

        return () => clearInterval(interval)
    }, [goalId, todoId, content, subject, saveToLocalStorage])

    return (
        <div className="flex flex-col w-full min-h-screen p-6 desktop:px-20">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-subTitle text-custom_slate-900">{isEdit ? '노트 수정' : '노트 작성'}</h1>
                <div className="flex gap-2">
                    <ButtonStyle
                        className="w-24 !font-normal rounded-xl border-0"
                        color="outline"
                        onClick={() => saveToLocalStorage(content)}
                    >
                        임시작성
                    </ButtonStyle>
                    <ButtonStyle className="w-24 bg-custom_slate-400 !font-normal rounded-xl">작성완료</ButtonStyle>
                </div>
            </div>
            {toast && (
                <div className="mt-4 py-3 px-4 rounded-full bg-custom_blue-50 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/notes/ic_delete.svg"
                            alt="닫기버튼"
                            width={24}
                            height={24}
                            onClick={() => setToast(false)}
                            className="cursor-pointer"
                        />
                        <div className="text-custom_blue-500">
                            임시 저장된 노트가 있어요. 저장된 노트를 불러오시겠어요?
                        </div>
                    </div>
                    <ButtonStyle color="outline" className="py-2 px-4 w-[84px] rounded-full text-sm">
                        불러오기
                    </ButtonStyle>
                </div>
            )}

            <div className="mt-4 flex items-center gap-2">
                <Image src="/goals/flag-goal.svg" alt="목표깃발" width={24} height={24} />
                <h2 className="text-subTitle-sm">원래는 notesData?.[0]?.goal.title을 받아 나타나야 함</h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                    <p>To do</p>
                </div>
                <p className=" text-custom_slate-700 text-subBody font-normal">
                    원래는 note.todo.title을 받아 나타나야함
                </p>
            </div>
            <div className="mt-6">
                {isEdit ? (
                    <NoteEditCompo noteId={noteId!} />
                ) : (
                    <NoteWriteCompo
                        content={content}
                        setContent={setContent}
                        subject={subject}
                        setSubject={setSubject}
                    />
                )}
            </div>
        </div>
    )
}

export default NoteWritePage
