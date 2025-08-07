'use client'

import React, {useEffect, useState} from 'react'

import useLayout from '@/hooks/use-layout'

import Sidebar from './components/client-sidebar'

const NavigationSidebar = () => {
    const [isOpen, setIsOpen] = useState<boolean | 'noState'>('noState')

    const isTablet = useLayout('tablet')
    const isDesktop = useLayout('desktop')
    const isMobile = useLayout('mobile')

    useEffect(() => {
        setIsOpen('noState')
    }, [isMobile, isDesktop, isTablet])

    const onClickHandler = () => {
        if (isDesktop && isOpen === 'noState') {
            setIsOpen(false)
        } else if ((isMobile || isTablet) && isOpen === 'noState') {
            setIsOpen(true)
        } else {
            setIsOpen(!isOpen)
        }
    }

    return (
        <>
            <aside
                aria-label="사이드바 네비게이션"
                className={` p-2 mobile:w-screen overflow-y-hidden   ${isOpen === 'noState' ? 'w-64 tablet:w-12 mobile:w-screen mobile:h-10' : isOpen ? 'w-64  animate-sidebar-open mobile:animate-mobile-open mobile:fixed ' : 'w-12 animate-sidebar-close mobile:animate-mobile-close'} tablet:z-50 mobile:z-50 relative  bg-white shadow-md h-screen flex flex-col overflow-x-hidden  shrink-0 

        `}
            >
                <Sidebar isOpen={isOpen} onClickHandler={onClickHandler} />
            </aside>
            <div
                className={`w-full ${isOpen === true && isTablet && 'tablet:flex'} hidden h-screen opacity-75 bg-black absolute z-20`}
                onClick={onClickHandler}
            />
        </>
    )
}

export default NavigationSidebar
