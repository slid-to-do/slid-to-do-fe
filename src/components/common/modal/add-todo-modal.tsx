'use client'

import Image from 'next/image'
import {useRef, useState} from 'react'

import {useQueryClient} from '@tanstack/react-query'
import axios from 'axios'
import clsx from 'clsx'

import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'
import {useCustomMutation} from '@/hooks/use-custom-mutation'
import {useInfiniteScrollQuery} from '@/hooks/use-infinite-scroll'
import useToast from '@/hooks/use-toast'
import {get, post} from '@/lib/api'
import {useModalStore} from '@/store/use-modal-store'

import type {GoalResponse} from '@/types/goals'
import type {PostTodoRequest} from '@/types/todos'

interface AddTodoModalProperties {
    goalId?: number
}

const AddTodoModal = ({goalId}: AddTodoModalProperties) => {
    const queryClient = useQueryClient()

    const [inputs, setInputs] = useState<PostTodoRequest>({
        title: '',
        goalId: goalId || undefined,
        linkUrl: '', // 빈 문자열로 초기화
    })

    const [isCheckedFile, setIsCheckedFile] = useState<boolean>(false)
    const [isCheckedLink, setIsCheckedLink] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [file, setFile] = useState<File | undefined>()

    const fileInputReference = useRef<HTMLInputElement>(null)

    const {clearModal} = useModalStore()

    const {showToast} = useToast()

    const getGoalsData = async (cursor: number | undefined) => {
        try {
            const urlParameter = cursor === undefined ? '' : `&cursor=${cursor}`
            const response = await get<{goals: GoalResponse[]; nextCursor: number | undefined}>({
                endpoint: `goals?size=3&sortOrder=newest${urlParameter}`,
            })

            if (response.data.goals.length <= 0) {
                showToast(
                    <div>
                        목표를 찾을 수 없습니다.
                        <br />
                        목표를 먼저 생성해주세요.
                    </div>,
                )
                clearModal()
            }

            return {
                data: response.data.goals,
                nextCursor: response.data.nextCursor,
            }
        } catch (fetchError) {
            if (fetchError instanceof Error) {
                throw fetchError
            }
            throw new Error(String(fetchError))
        }
    }

    const {
        data: fetchGoals,
        ref: goalReference,
        isLoading: loadingGoals,
        hasMore: hasMoreGoals,
    } = useInfiniteScrollQuery<GoalResponse>({
        queryKey: ['myGoals'],
        fetchFn: getGoalsData,
    })

    const uploadFileMutation = useCustomMutation<string>(
        async () => {
            const formData = new FormData()

            if (!file) {
                throw new Error('파일이 선택되지 않았습니다.')
            }

            formData.append('file', file)

            const response = await fetch('/api/upload?endpoint=files', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('파일 업로드에 실패했습니다.')
            }

            const {url} = await response.json()

            return url
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}
                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }
                return typedError.message || '파일 업로드에 실패했습니다.'
            },
        },
    )

    const submitForm = useCustomMutation<void, Error, void>(
        async () => {
            const payload: {
                title: string
                goalId: number | undefined
                fileUrl?: string
                linkUrl?: string
            } = {title: inputs.title, goalId: inputs.goalId}

            if (isCheckedFile && file) {
                const fileUrl = await uploadFileMutation.mutateAsync()
                payload.fileUrl = fileUrl
            }

            if (isCheckedLink) {
                payload.linkUrl = inputs.linkUrl
            }

            await post({
                endpoint: 'todos',
                data: payload,
            })
        },
        {
            errorDisplayType: 'toast',
            mapErrorMessage: (error) => {
                const typedError = error as {message?: string; response?: {data?: {message?: string}}}
                if (axios.isAxiosError(error)) {
                    return error.response?.data.message || '서버 오류가 발생했습니다.'
                }
                return typedError.message || '할 일 생성 중 오류가 발생했습니다.'
            },
            onSuccess: () => {
                showToast('할 일이 생성되었습니다.')
                queryClient.invalidateQueries({queryKey: ['todos']})
                queryClient.invalidateQueries({queryKey: ['todo']})
                clearModal()
            },
        },
    )

    const handleInputUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setInputs((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]

        if (selectedFile) {
            if (selectedFile.size > 3 * 1024 * 1024) {
                showToast('파일 크기는 3MB 이하로 제한됩니다.')
                return
            }
            setFile(selectedFile)
        }
    }

    return (
        <div className="absolute p-6 transform bg-white -translate-1/2 top-1/2 left-1/2 md:rounded-xl md:h-auto w-full h-full md:w-lg flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">할 일 생성</div>
                    <Image
                        src="/todos/ic-close.svg"
                        alt="Close Icon"
                        width={24}
                        height={24}
                        onClick={clearModal}
                        className="cursor-pointer"
                    />
                </div>

                {/* 제목 */}
                <div className="flex flex-col gap-3 mt-6">
                    <div className="text-base font-semibold">제목</div>
                    <InputStyle
                        type="text"
                        placeholder="할 일의 제목을 적어주세요"
                        value={inputs.title}
                        name="title"
                        onChange={handleInputUpdate}
                    />
                </div>

                {/* 목표 드롭다운 */}
                {/* goals API가 무한 스크롤 방식이기 때문에 input 태그 대신 div 태그로 구현 */}
                <div className="mt-6">
                    <div className="text-base font-semibold">목표</div>

                    <div className="relative px-5 py-3 bg-custom_slate-50 rounded-md">
                        <div
                            className={clsx('text-custom_slate-400 cursor-pointer', {
                                'text-custom_slate-800': inputs.goalId,
                            })}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {inputs.goalId
                                ? fetchGoals.find((goal) => goal.id === inputs.goalId)?.title
                                : '목표를 선택해주세요'}
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute left-0 w-full top-12 h-72 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {loadingGoals && fetchGoals.length === 0 ? (
                                    <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                                        로딩 중...
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {fetchGoals.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-custom_slate-400">
                                                등록된 목표가 없어요
                                            </div>
                                        ) : (
                                            <>
                                                {fetchGoals.map((goal, index) => (
                                                    <div
                                                        key={goal.id}
                                                        ref={
                                                            index === fetchGoals.length - 1 ? goalReference : undefined
                                                        } // 마지막 요소에 ref 연결
                                                        className="px-3 py-2 text-sm cursor-pointer hover:bg-custom_slate-100"
                                                        onClick={(event_) => {
                                                            event_.stopPropagation()
                                                            setInputs((previous) => ({...previous, goalId: goal.id}))
                                                            setIsDropdownOpen(false)
                                                        }}
                                                    >
                                                        {goal.title}
                                                    </div>
                                                ))}

                                                {/* 로딩 인디케이터 */}
                                                {loadingGoals && (
                                                    <div className="px-3 py-2 text-sm text-center text-custom_slate-400">
                                                        더 불러오는 중...
                                                    </div>
                                                )}

                                                {/* 더 이상 데이터가 없을 때 */}
                                                {!hasMoreGoals && fetchGoals.length > 0 && (
                                                    <div className="px-3 py-2 text-sm text-center text-custom_slate-400">
                                                        모든 목표를 불러왔습니다
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 자료 */}
                <div className="flex flex-col gap-3 mt-6">
                    <div className="text-base font-semibold">자료</div>
                    <div className="flex items-center gap-3">
                        <div
                            className={clsx(
                                'flex items-center gap-2 p-2 font-medium rounded-lg',
                                isCheckedFile
                                    ? 'bg-custom_slate-900 text-white'
                                    : 'bg-custom_slate-100 text-custom_slate-800',
                            )}
                            onClick={() => setIsCheckedFile(!isCheckedFile)}
                        >
                            <Image
                                src={
                                    isCheckedFile
                                        ? '/todos/ic-checkbox-active-white.svg'
                                        : '/todos/ic-checkbox-inactive.svg'
                                }
                                alt="Checkbox Icon"
                                width={18}
                                height={18}
                            />
                            파일 업로드
                        </div>

                        <div
                            className={clsx(
                                'flex items-center gap-2 p-2 font-medium rounded-lg',
                                isCheckedLink
                                    ? 'bg-custom_slate-900 text-white'
                                    : 'bg-custom_slate-100 text-custom_slate-800',
                            )}
                            onClick={() => setIsCheckedLink(!isCheckedLink)}
                        >
                            <Image
                                src={
                                    isCheckedLink
                                        ? '/todos/ic-checkbox-active-white.svg'
                                        : '/todos/ic-checkbox-inactive.svg'
                                }
                                alt="Checkbox Icon"
                                width={18}
                                height={18}
                            />
                            링크 첨부
                        </div>
                    </div>

                    {isCheckedLink && (
                        <InputStyle
                            type="text"
                            placeholder="링크를 입력해주세요"
                            value={inputs.linkUrl || ''} // undefined 방지
                            name="linkUrl"
                            onChange={handleInputUpdate}
                        />
                    )}

                    {isCheckedFile && (
                        <div
                            className="flex flex-col items-center justify-center gap-2 py-16 bg-custom_slate-50 rounded-xl"
                            onClick={() => {
                                fileInputReference.current?.click()
                            }}
                        >
                            {file ? (
                                <Image src="/todos/ic-uploaded.svg" alt="Uploaded Icon" width={24} height={24} />
                            ) : (
                                <Image src="/todos/ic-plus.svg" alt="Plus Icon" width={24} height={24} />
                            )}

                            <div className="text-custom_slate-400">{file ? file.name : '파일을 업로드해주세요'}</div>
                            <input type="file" hidden ref={fileInputReference} onChange={handleFileChange} />
                        </div>
                    )}
                </div>
            </div>

            {/* 확인 버튼 */}
            <div className="mt-6">
                <ButtonStyle
                    size="full"
                    disabled={!inputs.title.trim() || !inputs.goalId}
                    onClick={() => submitForm.mutate()}
                >
                    확인
                </ButtonStyle>
            </div>
        </div>
    )
}

export default AddTodoModal
