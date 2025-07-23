'use client'

import Image from 'next/image'
import {useRef, useState} from 'react'

import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import clsx from 'clsx'

import ButtonStyle from '@/components/style/button-style'
import InputStyle from '@/components/style/input-style'
import {get, post} from '@/lib/api'
import {useModalStore} from '@/store/use-modal-store'

interface AddTodoData {
    title: string
    fileUrl?: string
    linkUrl?: string
    goalId: number | undefined
}

interface GoalsResponse {
    nextCursor: number | undefined
    totalCount: number
    goals: Goal[]
}

interface Goal {
    updatedAt: string
    createdAt: string
    title: string
    id: number
    userId: number
    teamId: string
}

const AddTodoModal = () => {
    const queryClient = useQueryClient()

    const [inputs, setInputs] = useState<AddTodoData>({
        title: '',
        goalId: undefined,
    })

    const [isCheckedFile, setIsCheckedFile] = useState<boolean>(false)
    const [isCheckedLink, setIsCheckedLink] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [file, setFile] = useState<File | undefined>()

    const fileInputReference = useRef<HTMLInputElement>(null)

    const {clearModal} = useModalStore()

    const {data: goals, isLoading} = useQuery({
        queryKey: ['goals'],
        queryFn: async () => {
            const response = await get<GoalsResponse>({
                endpoint: 'goals',
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
            return response.data
        },
    })

    const uploadFileMutation = useMutation({
        mutationFn: async () => {
            const formData = new FormData()

            if (!file) {
                throw new Error('파일이 선택되지 않았습니다.')
            }

            formData.append('file', file)

            // 파일 업로드 API 호출
            // 파일 호출하는 API 함수를 구현하는 것보다 직접 호출하는 것이 더 간단하여
            // 직접 fetch를 사용합니다.
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                },
            })

            if (!response.ok) {
                throw new Error('파일 업로드에 실패했습니다.')
            }

            const {url} = await response.json()

            return url
        },
        onError: () => {
            setError('파일 업로드에 실패했습니다.')
        },
    })

    const submitForm = useMutation({
        mutationFn: async () => {
            const payload = {...inputs}

            if (isCheckedFile && file) {
                const fileUrl = await uploadFileMutation.mutateAsync()
                payload.fileUrl = fileUrl
            }

            if (isCheckedLink) {
                payload.linkUrl = inputs.linkUrl
            }

            return await post({
                endpoint: 'todos',
                data: payload,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('refreshToken')}`,
                    },
                },
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['todos']})
            clearModal()
        },
        onError: () => {
            setError('할 일 생성에 실패했습니다.')
        },
    })

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
                alert('파일 크기는 3MB 이하로 제한됩니다.')
                return
            }
            setFile(selectedFile)
        }
    }

    if (error) {
        return (
            <div className="absolute p-6 transform bg-white -translate-1/2 top-1/2 left-1/2 rounded-xl">
                <div className="text-red-500">{error}</div>
                <ButtonStyle onClick={clearModal}>닫기</ButtonStyle>
            </div>
        )
    }

    return (
        <div className="absolute p-6 transform bg-white -translate-1/2 top-1/2 left-1/2 rounded-xl">
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
                        value={inputs.linkUrl}
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

            {/* 목표 드롭다운 */}
            {/* goals API가 무한 스크롤 방식이기 때문에 input 태그 대신 div 태그로 구현 */}
            <div className="mt-6">
                <div className="text-base font-semibold">목표</div>

                <div className="relative px-5 py-3 bg-custom_slate-50">
                    <div
                        className={clsx('text-custom_slate-400', {'text-custom_slate-800': inputs.goalId})}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {inputs.goalId
                            ? goals?.goals.find((goal) => goal.id === inputs.goalId)?.title
                            : '목표를 선택해주세요'}
                    </div>

                    {isDropdownOpen && (
                        <div
                            className="absolute left-0 w-full h-full cursor-pointer top-12"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <div className="bg-white">
                                {isLoading ? (
                                    <div className="flex items-center justify-center w-full h-full text-sm text-custom_slate-400">
                                        로딩 중...
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        {goals?.goals.length === 0 ? (
                                            <div className="px-3 py-2 text-sm text-custom_slate-400">
                                                등록된 목표가 없어요
                                            </div>
                                        ) : (
                                            goals?.goals.map((goal) => (
                                                <div
                                                    key={goal.id}
                                                    className="px-3 py-2 text-sm rounded-lg hover:bg-custom_slate-100"
                                                    onClick={() => {
                                                        setInputs((previous) => ({...previous, goalId: goal.id}))
                                                        setIsDropdownOpen(false)
                                                    }}
                                                >
                                                    {goal.title}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 확인 버튼 */}
            <div className="mt-6">
                <ButtonStyle disabled={!inputs.title.trim() || !inputs.goalId} onClick={() => submitForm.mutate()}>
                    확인
                </ButtonStyle>
            </div>
        </div>
    )
}

export default AddTodoModal
