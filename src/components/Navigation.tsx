import React from 'react'

const Navgation = () => {
    return (
        <aside aria-label="사이드바 네비게이션" className="w-64 bg-white shadow-md h-screen flex flex-col">
            {/* 로고 및 유저 정보 */}
            <header className="p-4 border-b">
                <a href="/" className="flex items-center space-x-2 mb-4">
                    <img src="/logo.svg" alt="Slid to-do 로고" className="w-6 h-6" />
                    <span className="text-xl font-semibold">Slid to-do</span>
                </a>
                <div className="flex items-center space-x-3 mb-4">
                    <img src="/avatar.jpg" alt="체대치즈 프로필 사진" className="w-10 h-10 rounded-full" />
                    <div>
                        <p className="text-sm font-medium">체대치즈</p>
                        <a href="/logout" className="text-xs text-gray-500 hover:underline">
                            로그아웃
                        </a>
                    </div>
                </div>
                <button type="button" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
                    + 새 할일
                </button>
            </header>

            {/* 주요 네비게이션 */}
            <nav aria-label="주요" className="flex-1 overflow-y-auto">
                <ul className="p-4 space-y-2">
                    <li>
                        <a href="/dashboard" className="block py-2 text-black px-3 rounded hover:bg-gray-100">
                            대시보드
                        </a>
                    </li>
                </ul>
            </nav>

            {/* 목표 섹션 */}
            <section aria-labelledby="goals-heading" className="p-4 border-t">
                <h2 id="goals-heading" className="text-sm font-semibold mb-2 text-gray-700">
                    목표
                </h2>
                <ul className="space-y-1 mb-4">
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
                    className="w-full border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
                >
                    + 새 목표
                </button>
            </section>
        </aside>
    )
}

export default Navgation
