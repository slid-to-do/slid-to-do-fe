'use client '

import Image from 'next/image'
import {useRouter} from 'next/navigation'
import React from 'react'

import {useQuery} from '@tanstack/react-query'
import axios from 'axios'

import useToast from '@/hooks/use-toast'
import {get} from '@/lib/common-api'

import type {UserType} from '@/types/user'

// 로고 및 유저 정보 Component
const SidebarProfile = () => {
    const router = useRouter()
    const {showToast} = useToast()
    const {data: userData} = useQuery({
        queryKey: ['userData'],
        queryFn: async () => {
            try {
                const response = await get<UserType>({
                    endpoint: `user`,
                    options: {
                        headers: {Authorization: `Bearer ${localStorage.getItem('refreshToken')}`},
                    },
                })

                return {
                    data: response.data,
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    throw error
                }
                throw new Error(String(error))
            }
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
        <div className="flex w-full h-auto gap-2 mb-4 justify-between items-center">
            <Image
                src={'/sidebar/profile.svg'}
                alt="profile"
                width={24}
                height={24}
                className=" w-16 h-16 p-2 rounded-full mobile:w-5 mobile:h-5 mobile:p-0"
            />
            <div className="w-full flex-1 min-w-0  h-auto mobile:flex mobile: justify-between mobile:items-end ">
                <div className="flex-1 min-w-0 w-full">
                    <p className="text-sm font-medium truncate">{userData?.data.name}</p>
                    <p className="text-sm font-medium truncate">{userData?.data.email}</p>
                </div>

                <button className="text-xs text-gray-500 hover:underline" onClick={handleLogout}>
                    로그아웃
                </button>
            </div>
        </div>
    )
}

export default SidebarProfile
