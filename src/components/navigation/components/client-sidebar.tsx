'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// import Expand from '@/../public/sidebar/ic_expand.svg'
import AddTodoModal from '@/components/common/modal/add-todo-modal'
import HamburgerToggle from '@/components/style/hamburger-toggle'
import useLayout from '@/hooks/use-layout'
import useModal from '@/hooks/use-modal'

import SidebarList from './goal-list'
import SidebarProfile from './sidebar-profile'
import ButtonStyle from '../../style/button-style'

import type {ClientInterface} from '@/types/sidebar'

const ClientSidebar = ({isOpen, onClickHandler}: ClientInterface) => {
    const isMobile = useLayout('mobile')
    const {openModal} = useModal(<AddTodoModal />)

    return (
        <>
            <header className=" h-auto w-full border-b-[#E2E8F0] flex justify-between items-center mb-5">
                <Link
                    href="/"
                    className={`${isOpen === 'noState' ? 'flex tablet:hidden mobile:hidden' : isOpen ? 'flex animate-opacity-open' : 'hidden animate-opacity-close '} w-auto h-[32px] min-w-[32px] flex`}
                >
                    <div className={`flex justify-center items-center w-auto h-full `}>
                        <Image
                            src={'/ic-favicon.svg'}
                            alt="Logo"
                            width={32}
                            height={32}
                            className="w-[32px] hover:opacity-80"
                        />
                        <Image
                            src={'/slid-to-do.svg'}
                            alt="Logo"
                            width={80}
                            height={15}
                            className="w-[80px] h-[15px]"
                        />
                    </div>
                </Link>
                {isMobile ? (
                    <button onClick={onClickHandler} className=" w-8 h-5 bg-red flex justify-center items-center ">
                        <HamburgerToggle group={isOpen} />
                    </button>
                ) : (
                    <button
                        className={` mobile:hidden absolute right-2 top-2 group  rounded-lg w-8 h-8 flex justify-center items-center z-10  ${isOpen === 'noState' ? 'rotate-180 tablet:rotate-0 ' : isOpen ? 'rotate-180 ' : 'rotate-0 '} `}
                        onClick={onClickHandler}
                    >
                        <Image
                            src={'/sidebar/ic-expand.svg'}
                            alt="expand"
                            width={26}
                            height={25}
                            className=" w-6 h-6 fill-white text-slate-400 group-hover:text-slate-300"
                        />
                    </button>
                )}
            </header>
            <div
                className={` flex-1 min-h-0    flex-col w-full h-full  ${isOpen === 'noState' ? 'flex tablet:hidden mobile:hidden' : isOpen ? 'flex animate-opacity-open ' : ' animate-opacity-close mobile:hidden'}`}
            >
                <SidebarProfile />
                {!isMobile && (
                    <ButtonStyle size="full" onClick={openModal}>
                        + 새 할일
                    </ButtonStyle>
                )}
                <hr className=" mt-5 -mx-5 border-t-2 border-gray-200" />
                {/* 주요 네비게이션 */}
                <nav
                    aria-label="주요"
                    className=" w-full h-13 min-h-13 overflow-y-auto flex flex-col max-sm:flex-row max-sm:justify-between max-sm:items-center justify-center items-start "
                >
                    <Link
                        href={'/dashboard'}
                        className=" py-2 p-2 w-full h-auto  text-subTitle-base text-custom_slate-700 flex items-center gap-3 hover:opacity-80  "
                    >
                        <Image
                            src={'/sidebar/home.svg'}
                            width={15}
                            height={15}
                            alt="Subtract"
                            className="w-[15px] h-[15px]"
                        />
                        대시보드
                    </Link>
                    {isMobile && (
                        <ButtonStyle onClick={openModal} size="small">
                            + 새 할일
                        </ButtonStyle>
                    )}
                </nav>
                <hr className=" -mx-5  border-t-2 border-gray-200" />
                {/* 목표 섹션 */}
                <SidebarList isMobile={isMobile} />
            </div>
        </>
    )
}

export default ClientSidebar
