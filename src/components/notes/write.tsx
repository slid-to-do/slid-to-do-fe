'use client'

import Image from 'next/image'
import {useRouter} from 'next/navigation'
import {useCallback, useEffect, useState} from 'react'

import {useMutation} from '@tanstack/react-query'
import {ToastContainer, toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import TwoButtonModal from '@/components/common/modal/two-buttom-modal'
import MarkdownEditor from '@/components/markdown-editor/markdown-editor'
import ButtonStyle from '@/components/style/button-style'
import useModal from '@/hooks/use-modal'
import {post} from '@/lib/api'
import {useModalStore} from '@/store/use-modal-store'

import InputStyle from '../style/input-style'

import type {NoteCommon} from '@/types/notes'

const getTextFromHtml = (html: string): string => {
    if (typeof globalThis === 'undefined') return html
    const temporaryElement = document.createElement('div')
    temporaryElement.innerHTML = html
    return temporaryElement.textContent || ''
}

const NoteWriteCompo = ({
    goalId,
    todoId,
    goalTitle,
    todoTitle,
}: {
    goalId: string
    todoId: string
    goalTitle: string | undefined
    todoTitle: string | undefined
}) => {
    const router = useRouter()
    const [saveToastOpen, setSaveToastOpen] = useState<boolean>(false)
    const [hasLocalNote, setHasLocalNote] = useState(false)
    const [content, setContent] = useState<string>('')
    const [subject, setSubject] = useState<string>('')
    const [saveSubject, setSaveSubject] = useState<string>('')
    const [saveContent, setSaveContent] = useState<string>('')
    const [linkButton, setLinkButton] = useState<string | undefined>(undefined)

    const {clearModal} = useModalStore()

    const key = `note-draft-${goalId}-${todoId}`

    /** 작성페이지 검사 */
    useEffect(() => {
        if (todoId === undefined || goalId === undefined) {
            alert('확인 할 데이터가 없습니다.') // 에러페이지로 이동
        } else {
            const saved = localStorage.getItem(key)

            if (saved) {
                const parsed = JSON.parse(saved)
                setSaveSubject(parsed.editSubject)
                setSaveContent(parsed.editContent)
                setSaveToastOpen(true)
            }
        }
    }, [todoId, goalId, key])

    /** 임시 작성 함수 */
    const saveToLocalStorage = useCallback(
        (editContent: string) => {
            if ((content === '<p></p>' || content === '') && subject === '') {
                alert('제목 또는 내용을 입력해주세요.')
                return
            }

            const value = JSON.stringify({
                goalId,
                todoId,
                editContent,
                editSubject: subject,
            })
            localStorage.setItem(key, value)
            toast('임시저장이 완료되었습니다')
        },
        [goalId, todoId, subject, content, key],
    )

    /** 5분에 한번 임시저장 */
    useEffect(() => {
        if (!goalId || !todoId) return
        if ((content === '<p></p>' || content === '') && subject === '') return
        if (saveContent === content && saveSubject === subject) return

        const interval = setInterval(
            () => {
                saveToLocalStorage(content)
            },
            1 * 60 * 1000,
        )

        return () => clearInterval(interval)
    }, [goalId, todoId, content, subject, saveToLocalStorage, saveContent, saveSubject])

    /** 임시저장 불러오기 모달 */
    const comeSave = () => {
        setHasLocalNote(true)
        clearModal()
    }
    const {openModal} = useModal(
        () => (
            <TwoButtonModal
                handleLeftBtn={clearModal}
                handleRightBtn={comeSave}
                topText={`'${saveSubject === '' || saveSubject === undefined ? '제목없음' : saveSubject}'`}
                bottomText={'제목의 노트를 불러오시겠어요?'}
                buttonText={'불러오기'}
            />
        ),
        {
            modalAnimation: 'slideFromTop',
            backdropAnimation: 'fade',
        },
    )

    /** 임시저장 불러오기 클릭 시 내용저장 */
    useEffect(() => {
        if (hasLocalNote) {
            const saved = localStorage.getItem(`note-draft-${goalId}-${todoId}`)
            if (saved) {
                const parsed = JSON.parse(saved)
                setContent(parsed.editContent || '')
                setSubject(parsed.editSubject || '')
            }
        }
    }, [hasLocalNote, goalId, todoId, setContent, setSubject])

    /** 제목 confirm */
    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target
        if (value.length <= 30) {
            setSubject(value)
        } else {
            alert('제목은 최대 30자까지 입력 가능합니다.')
        }
    }

    /** 내용 value cahnge */
    const handleEditorUpdate = (html: string) => {
        setContent(html)
    }

    const payload = {
        todoId: Number(todoId),
        title: subject,
        content: getTextFromHtml(content),
        ...(linkButton && {linkUrl: linkButton}),
    }

    /** 저장하기 */
    const saveNotes = useMutation({
        mutationFn: async () => {
            if (!confirm('작성을 완료하시겠습니까?')) return

            const response = await post<NoteCommon>({
                endpoint: `notes`,
                data: payload,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
            if (response.status === 201) {
                alert('작성이 완료되었습니다.')
                router.push(`/notes/write?noteId=${response.data.id}`)
            } else {
                alert(response.message)
            }

            return response.data
        },
    })

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
                    <ButtonStyle
                        className="w-24 bg-custom_slate-400 !font-normal rounded-xl"
                        disabled={!content || content === '<p></p>' || content === ''}
                        onClick={() => saveNotes.mutate()}
                    >
                        작성완료
                    </ButtonStyle>
                </div>
            </div>
            {saveToastOpen && (
                <div className="mt-4 py-3 px-4 rounded-full bg-custom_blue-50 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/notes/ic_delete.svg"
                            alt="닫기버튼"
                            width={24}
                            height={24}
                            onClick={() => setSaveToastOpen(false)}
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
                <h2 className="text-subTitle-sm">{goalTitle}</h2>
            </div>
            <div className="mt-3 flex items-center gap-2">
                <div className="p-1 bg-custom_slate-100 text-custom_slate-700 text-subBody font-medium rounded-sm">
                    <p>To do</p>
                </div>
                <p className=" text-custom_slate-700 text-subBody font-normal">{todoTitle}</p>
            </div>
            <div className="mt-6">
                <div className="border-t border-b flex items-center">
                    <InputStyle
                        type="text"
                        placeholder="노트의 제목을 적어주세요"
                        value={subject}
                        name="title"
                        onChange={handleInputUpdate}
                        className={'bg-white px-0'}
                        maxLength={30}
                    />
                    <div className="text-xs font-medium">{subject.length}/30</div>
                </div>
                <ToastContainer />
                <div className="mt-3">
                    <MarkdownEditor
                        key={content === '' ? 'note-original' : `note-${goalId}-${todoId}`}
                        value={content}
                        onUpdate={handleEditorUpdate}
                        linkButton={linkButton}
                        onSetLinkButton={setLinkButton}
                    />
                </div>
            </div>
        </>
    )
}

export default NoteWriteCompo
