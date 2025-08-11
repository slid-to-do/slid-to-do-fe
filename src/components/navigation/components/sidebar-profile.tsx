'use client '

import Image from 'next/image'
import {useRouter} from 'next/navigation'
import React from 'react'

import axios from 'axios'

import {useCustomQuery} from '@/hooks/use-custom-query'
import useToast from '@/hooks/use-toast'
import {get} from '@/lib/api'

import type {UserType} from '@/types/user'

const getProfile = async (): Promise<UserType> => {
    const response = await get<UserType>({endpoint: `user`})
    return response.data
}

// 로고 및 유저 정보 Component
const SidebarProfile = () => {
    const router = useRouter()
    const {showToast} = useToast()
    const {data: userData} = useCustomQuery<UserType>(['userData'], async () => getProfile(), {
        errorDisplayType: 'toast',
        mapErrorMessage: (error) => {
            const typedError = error as {message?: string; response?: {data?: {message?: string}}}

            if (axios.isAxiosError(error)) {
                return error.response?.data.message || '서버 오류가 발생했습니다.'
            }

            return typedError.message || '알 수 없는 오류가 발생했습니다.'
        },
    })
    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logout', {
                withCredentials: true,
            })

            router.push('/login')
            showToast('로그아웃이 되었습니다.', {type: 'success'})
        } catch {
            showToast('로그아웃에 실패했습니다.', {type: 'error'})
        }
    }

    return (
        <div className="flex w-full h-auto  gap-2 mb-4 justify-between items-center ">
            <Image
                src={'/sidebar/profile.svg'}
                alt="profile"
                width={24}
                height={24}
                className=" w-16 h-16 p-2 rounded-full mobile:w-5 mobile:h-5 mobile:p-0"
            />
            <div className="w-full h-auto mobile:flex mobile: justify-between mobile:items-end">
                <div className="flex flex-col">
                    <p className="text-sm font-medium overflow-x-hidden w-full">{userData?.name}</p>
                    <p className="text-sm font-medium overflow-x-hidden w-full">{userData?.email}</p>
                </div>

                <button className="text-xs text-gray-500 hover:underline" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    )
}

export default SidebarProfile
