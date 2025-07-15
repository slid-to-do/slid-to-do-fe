'use client'

import React, {useEffect, useState} from 'react'

import useLayout from '@/hooks/use-layout'

import Sidebar from './components/client-sidebar'

const NavigationSidebar = () => {
    const [isOpen, setIsOpen] = useState<boolean | null>(null)

    const isTablet = useLayout('tablet')
    const isDesktop = useLayout('desktop')
    const isMobile = useLayout('mobile')

    useEffect(() => {
        setIsOpen(null)
        if (isDesktop) console.log('isDesktop')
        if (isTablet) console.log('isTablet')
        if (isMobile) console.log('isMobile')
        console.log(isOpen)
    }, [isMobile, isDesktop, isTablet])

    const onClickHandler = () => {
        if (isDesktop && isOpen === null) {
            setIsOpen(false)
            console.log('false')
        } else if (isMobile && isTablet && isOpen === null) {
            setIsOpen(true)
            console.log('true')
        } else {
            setIsOpen(!isOpen)
        }
    }

    return (
        <>
            <aside
                aria-label="사이드바 네비게이션"
                className={` p-2 mobile:w-screen   ${isOpen === null ? 'w-64 tablet:w-12 mobile:w-screen mobile:h-10' : isOpen ? 'w-64  animate-sidebar-open mobile:animate-mobile-open mobile:fixed ' : 'w-12 animate-sidebar-close mobile:animate-mobile-close'}   bg-white shadow-md h-screen flex flex-col overflow-x-hidden relative shrink-0 z-10
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
