'use client'

import Image from 'next/image'
import {useEffect, useRef, useState} from 'react'

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
    const [isCheckedFile, setIsCheckedFile] = useState<boolean>(false)
    const [isCheckedLink, setIsCheckedLink] = useState<boolean>(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
    const fileInputReference = useRef<HTMLInputElement>(null)
    const [goals, setGoals] = useState<Goal[]>([])
    const [file, setFile] = useState<File | undefined>()

    const [error, setError] = useState<string>('')

    const [formData, setFormData] = useState<AddTodoData>({
        title: '',
        goalId: undefined,
    })

    const {clearModal} = useModalStore()

    const getGoals = async () => {
        const response = await get<GoalsResponse>({
            endpoint: 'goals',
            options: {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            },
        })
        setGoals(response.data.goals)
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }))
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]

        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    const uploadFile = async () => {
        if (!file) return

        const fd = new FormData()
        fd.append('file', file)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/files`, {
                method: 'POST',
                body: fd,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })

            const data = await response.json()

            return data.url
        } catch {
            setError('파일 업로드에 실패했습니다.')
        }
    }

    const handleSubmit = async () => {
        const payload = {...formData}

        if (isCheckedFile) {
            const fileUrl = await uploadFile()
            payload.fileUrl = fileUrl
        }

        if (isCheckedLink) {
            payload.linkUrl = formData.linkUrl
        }

        try {
            await post({
                endpoint: 'todos',
                data: payload,
                options: {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                },
            })
            clearModal()
        } catch {
            setError('할 일 생성에 실패했습니다.')
        }
    }

    useEffect(() => {
        getGoals()
    }, [])

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
                    value={formData.title}
                    name="title"
                    onChange={handleChange}
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
                        value={formData.linkUrl}
                        name="linkUrl"
                        onChange={handleChange}
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

            {/* 목표 */}
            <div className="mt-6">
                <div className="text-base font-semibold">목표</div>

                <div className="relative px-5 py-3 bg-custom_slate-50">
                    <div
                        className={clsx('text-custom_slate-400', {'text-custom_slate-800': formData.goalId})}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {formData.goalId
                            ? goals.find((goal) => goal.id === formData.goalId)?.title
                            : '목표를 선택해주세요'}
                    </div>
                    <div
                        className="absolute left-0 w-full h-full cursor-pointer top-12"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {isDropdownOpen && (
                            <div className="bg-white">
                                {goals.map((goal) => (
                                    <div
                                        key={goal.id}
                                        className="px-3 py-2 text-sm rounded-lg hover:bg-custom_slate-100"
                                        onClick={() => {
                                            setFormData((previous) => ({...previous, goalId: goal.id}))
                                            setIsDropdownOpen(false)
                                        }}
                                    >
                                        {goal.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6">
                <ButtonStyle disabled={!formData.title.trim() || !formData.goalId} onClick={handleSubmit}>
                    확인
                </ButtonStyle>
            </div>
        </div>
    )
}

export default AddTodoModal
