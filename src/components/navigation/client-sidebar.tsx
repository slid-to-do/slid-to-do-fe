'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import {motion} from 'motion/react'

import Expand from '@/../public/sidebar/ic_expand.svg'
import useLayout from '@/hooks/use-layout'

import ButtonStyle from '../style/button-style'
import SidebarList from './components/goal-list'
import SidebarProfile from './components/sidebar-profile'
import {disappearAnimation, buttonAnimation} from './util/motion-variants'

import {ClientInterface} from '@/types/sidebar'

const ClientSidebar = ({isClose, controls, setIsClose}: ClientInterface) => {
    const isMobile = useLayout('mobile')

    return (
        <>
            <motion.header
                transition={{duration: 0.3, delay: 0.3}}
                className="  h-auto w-full border-b-[#E2E8F0] flex justify-between items-center "
            >
                <Link href="/" className="flex w-auto h-[32px] min-w-[32px]  ">
                    <Image
                        src={'./ic_favicon.svg'}
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-[32px] hover:opacity-80"
                    />
                    <motion.div
                        variants={disappearAnimation}
                        animate={controls}
                        className="flex justify-center items-center w-auto h-auto "
                    >
                        <Image
                            src={'./slid-to-do.svg'}
                            alt="Logo"
                            loading={'lazy'}
                            width={80}
                            height={15}
                            className="w-[80px] h-[15px]"
                        />
                    </motion.div>
                </Link>

                <motion.button
                    variants={buttonAnimation}
                    initial={isClose ? 'open' : 'close'}
                    animate={isClose ? 'open' : 'close'}
                    transition={{duration: 0.3}}
                    className=" group  rounded-lg w-8 h-8 flex justify-center items-center z-30 "
                    onClick={() => setIsClose(!isClose)}
                >
                    <Expand
                        className={`  ${isClose ? 'x-28' : 'x-0'} x  w-6 h-6 fill-white text-slate-400 group-hover:text-slate-300  `}
                    />
                </motion.button>
            </motion.header>
            <motion.div
                layout
                variants={disappearAnimation}
                animate={controls}
                className={`flex  ${isClose ? ' tablet:flex' : 'tablet:hidden'} flex-col h-full `}
            >
                <SidebarProfile />
                {!isMobile && <ButtonStyle size="full">+ 새 할일</ButtonStyle>}
                <hr className=" mt-5 -mx-5 border-t-2 border-gray-200" />
                {/* 주요 네비게이션 */}

                <nav
                    aria-label="주요"
                    className=" w-full h-13 min-h-13 overflow-y-auto flex flex-col max-sm:flex-row max-sm:justify-between max-sm:items-center justify-center items-start "
                >
                    <Link
                        href={'/'}
                        className=" py-2 p-2 w-full h-auto  text-subTitle-base text-custom_slate-700 flex items-center gap-3 hover:opacity-80  "
                    >
                        <Image
                            src={'./sidebar/home.svg'}
                            width={15}
                            height={15}
                            alt="Subtract"
                            className="w-[15px] h-[15px]"
                        />
                        대시보드
                    </Link>
                    {isMobile && <ButtonStyle size="small">+ 새 할일</ButtonStyle>}
                </nav>
                <hr className=" -mx-5  border-t-2 border-gray-200" />

                {/* 목표 섹션 */}
                <SidebarList isMobile={isMobile} />
            </motion.div>
        </>
    )
}

export default ClientSidebar
