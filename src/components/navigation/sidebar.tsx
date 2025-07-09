'use client'

import React from 'react'
import Image from 'next/image'
import GoalModal from './goal-modal'
import {useModal} from '@/hooks/use-modal'
import Link from 'next/link'

const NavigationSidebar = () => {
    const {openModal, closeModal} = useModal(<GoalModal />)

    return (
        <aside
            aria-label="사이드바 네비게이션"
            className=" w-64 text-black bg-slate-300 shadow-md h-screen gap-6 flex flex-col justify-start p-[20px]"
        >
            {/* 로고 및 유저 정보 */}
            <header className=" p-5 h-auto w-full bg-amber-300 border-b-[#E2E8F0]">
                <Link href="/" className="flex w-full items-center gap-x-2 mb-4">
                    <Image src={'./ic_favicon.svg'} alt="Logo" width={24} height={24} />
                    <Image src={'./slid-to-do.svg'} alt="Logo" width={80} height={15} />
                </Link>
            </header>
            <div className="flex items-center gap-x-3 mb-4">
                {/* <img src="/avatar.jpg" alt="체대치즈 프로필 사진" className="w-10 h-10 rounded-full" /> */}
                <div className="w-10 h-10"></div>
                <div>
                    <p className="text-sm font-medium">체대치즈</p>
                    <a href="/logout" className="text-xs text-gray-500 hover:underline">
                        로그아웃
                    </a>
                </div>
            </div>
            <button type="button" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                + 새 할일
            </button>

            {/* 주요 네비게이션 */}
            <nav aria-label="주요" className="overflow-y-auto">
                <ul className="p-4 flex flex-col gap-y-2">
                    <li>
                        <a href="/dashboard" className="block py-2 px-3 rounded hover:bg-gray-100">
                            대시보드
                        </a>
                    </li>
                </ul>
            </nav>
            {/* 목표 섹션 */}
            <section aria-labelledby="goals-heading" className="p-4  border-[#E2E8F0]">
                <h2 id="goals-heading" className="text-sm font-semibold mb-2 text-gray-700">
                    목표
                </h2>
                <ul className="flex flex-col gap-y-1 mb-4">
                    <li>
                        <a href="/goals/1" className="block py-1 px-2 rounded hover:bg-gray-100">
                            재네스크립트로 웹 서비스 만들기
                        </a>
                    </li>
                    <li>
                        <a href="/goals/2" className="block py-1 px-2 rounded hover:bg-gray-100">
                            디자인 시스템 갈아 새기
                        </a>
                    </li>
                </ul>
                <button
                    type="button"
                    onClick={openModal}
                    className="w-full border cursor-pointer border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
                >
                    + 새 목표
                </button>
            </section>
        </aside>
    )
}

export default NavigationSidebar
