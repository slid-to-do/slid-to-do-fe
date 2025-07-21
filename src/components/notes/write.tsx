'use client'

import Image from 'next/image'
import {useCallback, useEffect, useState} from 'react'

import TwoButtonModal from '@/components/common/modal/two-buttom-modal'
import MarkdownEditor from '@/components/markdown-editor/markdown-editor'
import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'
import useModal from '@/hooks/use-modal'
import {useModalStore} from '@/store/use-modal-store'

const NoteWriteCompo = ({
    goalId,
    todoId,
    goalTitle,
    todoTitle,
}: {
    goalId: string
    todoId: string
    goalTitle: string
    todoTitle: string
}) => {
    const [toast, setToast] = useState<boolean>(false)
    const [hasLocalNote, setHasLocalNote] = useState(false)
    const [content, setContent] = useState<string>('')
    const [subject, setSubject] = useState<string>('')
    const [saveSubject, setSaveSubject] = useState<string>('')

    const [localContent, setLocalContent] = useState(content)
    const [localSubject, setLocalSubject] = useState(subject)

    const {clearModal} = useModalStore()

    const key = `note-draft-${goalId}-${todoId}`

    useEffect(() => {
        if (todoId === undefined || goalId === undefined) {
            alert('확인 할 데이터가 없습니다.') // 에러페이지로 이동
        } else {
            const saved = localStorage.getItem(key)

            if (saved) {
                const parsed = JSON.parse(saved)
                setSaveSubject(parsed.editSubject)
                setToast(true)
            }
        }
    }, [todoId, goalId, key])

    /**임시 작성 */
    const saveToLocalStorage = useCallback(
        (editContent: string) => {
            if ((content === '<p></p>' || content === '') && subject === '') {
                alert('제목 또는 내용을 입력해주세요.')
            }

            let editSubject = subject
            if (subject === '') {
                editSubject = '제목없음'
            }

            const value = JSON.stringify({
                goalId,
                todoId,
                editContent,
                editSubject,
            })
            localStorage.setItem(key, value)
            alert('임시 저장이 완료되었습니다')
        },
        [goalId, todoId, subject, content, key],
    )

    useEffect(() => {
        if (!goalId || !todoId) return
        if ((content === '<p></p>' || content === '') && subject === '') return
        const interval = setInterval(
            () => {
                saveToLocalStorage(content)
            },
            5 * 60 * 1000,
        )

        return () => clearInterval(interval)
    }, [goalId, todoId, content, subject, saveToLocalStorage])

    const comeSave = () => {
        setHasLocalNote(true)
        clearModal()
    }

    const {openModal} = useModal(
        () => (
            <TwoButtonModal
                handleLeftBtn={clearModal}
                handleRightBtn={comeSave}
                topText={`'${saveSubject}'`}
                bottomText={'제목의 노트를 불러오시겠어요?'}
                buttonText={'불러오기'}
            />
        ),
        {
            modalAnimation: 'slideFromTop',
            backdropAnimation: 'fade',
        },
    )

    useEffect(() => {
        if (hasLocalNote) {
            const saved = localStorage.getItem(`note-draft-${goalId}-${todoId}`)
            if (saved) {
                const parsed = JSON.parse(saved)
                setLocalContent(parsed.editContent || '')
                setLocalSubject(parsed.editSubject || '')
                setContent(parsed.editContent || '')
                setSubject(parsed.editSubject || '')
            }
        }
    }, [hasLocalNote, goalId, todoId, setContent, setSubject])

    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target
        setLocalSubject(value)
        setSubject(value)
    }

    const handleEditorUpdate = (html: string) => {
        setLocalContent(html)
        setContent(html)
    }

    return (
        <>
            <div className="w-full flex justify-between items-center">
                <h1 className="text-subTitle text-custom_slate-900">{'노트 작성'}</h1>
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
                    <ButtonStyle
                        color="outline"
                        className="py-2 px-4 w-[84px] rounded-full text-sm"
                        onClick={openModal}
                    >
                        불러오기
                    </ButtonStyle>
                </div>
            )}

            <div className="mt-4 flex items-center gap-2">
                <Image src="/goals/flag-goal.svg" alt="목표깃발" width={24} height={24} />
                <h2 className="text-subTitle-sm">원래는 {goalTitle}을 받아 나타나야 함</h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                    <p>To do</p>
                </div>
                <p className=" text-custom_slate-700 text-subBody font-normal">원래는 {todoTitle}을 받아 나타나야함</p>
            </div>
            <div className="mt-6">
                <div className="border-t border-b">
                    <InputStyle
                        type="text"
                        placeholder="노트의 제목을 적어주세요"
                        value={localSubject}
                        name="title"
                        onChange={handleInputUpdate}
                    />
                </div>
                <div className="mt-3">
                    <MarkdownEditor
                        key={localContent === '' ? 'note-original' : `note-${goalId}-${todoId}`}
                        value={localContent}
                        onUpdate={handleEditorUpdate}
                    />
                </div>
            </div>
        </>
    )
}

export default NoteWriteCompo
