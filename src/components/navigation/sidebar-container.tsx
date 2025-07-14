'use client'

import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react'

import {motion, useAnimationControls} from 'motion/react'

import useLayout from '@/hooks/use-layout'

import {widthAnimation} from './util/motion-variants'

import Sidebar from './components/client-sidebar'

const NoSSR = dynamic(() => import('./components/client-sidebar'), {ssr: false})

const NavigationSidebar = () => {
    const [isOpen, setIsOpen] = useState<boolean | null>(null)
    const [hasClick, setHasClick] = useState<boolean | null>(null)

    const controls = useAnimationControls()

    const isTablet = useLayout('tablet')
    const isDesktop = useLayout('desktop')
    const isMobile = useLayout('mobile')

    useEffect(() => {
        setIsOpen(null)
    }, [isMobile, isDesktop, isTablet])

    const onClickHandler = () => {
        if (!isTablet && isOpen === null) {
            setIsOpen(false)
        } else if (isTablet && isOpen === null) {
            setIsOpen(true)
        } else {
            setIsOpen(!isOpen)
        }
    }

    return (
        <>
            <aside
                aria-label="사이드바 네비게이션"
                className={` p-2  mobile:w-screen ${isOpen === null ? 'w-64 tablet:w-12 ' : isOpen ? 'w-64 animate-sidebar-open ' : 'w-12 animate-sidebar-close '}  tablet:bg-red-200 bg-white shadow-md h-screen flex flex-col overflow-x-hidden relative shrink-0 z-10
        `}
            >
                <Sidebar isOpen={isOpen} onClickHandler={onClickHandler} />
            </aside>
            <div
                className={`w-full ${isOpen === true && isTablet && 'tablet:flex'} hidden h-screen opacity-75 bg-black absolute`}
                onClick={onClickHandler}
            />
        </>
    )
}

export default NavigationSidebar
