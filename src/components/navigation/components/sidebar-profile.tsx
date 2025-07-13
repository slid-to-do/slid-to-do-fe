'use client '

import Image from 'next/image'
import React from 'react'

// 로고 및 유저 정보 Component
const SidebarProfile = () => {
    return (
        <div className="flex w-full h-auto  gap-2 mb-4 justify-between items-center ">
            <Image
                src={'./sidebar/profile.svg'}
                alt="profile"
                width={24}
                height={24}
                className=" w-16 h-16 p-2 rounded-full max-sm:w-5 max-sm:h-5 max-sm:p-0"
            />
            <div className="w-full h-auto max-sm:flex max-sm: justify-between max-sm:items-end">
                <div className="flex flex-col">
                    <p className="text-sm font-medium overflow-x-hidden w-full">체대치즈</p>
                    <p className="text-sm font-medium overflow-x-hidden w-full">codeit@gmail.com</p>
                </div>

                <button className="text-xs text-gray-500 hover:underline">로그아웃</button>
            </div>
        </div>
    )
}

export default SidebarProfile
