'use client'

import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react'

import {motion, useAnimationControls} from 'motion/react'

import useLayout from '@/hooks/use-layout'

import {widthAnimation} from './util/motion-variants'

const NoSSR = dynamic(() => import('./components/client-sidebar'), {ssr: false})

const NavigationSidebar = () => {
    const [isOpen, setIsOpen] = useState(true)

    const controls = useAnimationControls()

    const isTablet = useLayout('tablet')
    const isMobile = useLayout('mobile')

    useEffect(() => {
        if (isTablet) {
            setIsOpen(false)
            // console.log('open', isMobile, isTablet)
            controls.start('close')
        } else if (isMobile && !isTablet) {
            // console.log('mobile', isMobile, isTablet)
            controls.start('mobile')
        } else if (!isMobile || !isTablet) {
            setIsOpen(true)
            // console.log('mobile', isMobile, isTablet, window.innerWidth)
            controls.start('open')
        }
    }, [isTablet, isMobile, controls])

    const onClickHandler = () => {
        if (isOpen && !isMobile) {
            setIsOpen(false)
            controls.start('close')
            // console.log('open animation')
        } else if (!isOpen && isMobile) {
            setIsOpen(true)
            controls.start('mobile')
            // console.log('mobile animation')
        } else if (isOpen && isMobile) {
            setIsOpen(false)
            // console.log('mobileClose')
            controls.start('mobileClose')
        } else {
            controls.start('open')
            // console.log('no mobile open')
            setIsOpen(true)
        }
    }

    return (
        <>
            <motion.aside
                variants={widthAnimation}
                animate={controls}
                aria-label="사이드바 네비게이션"
                className={` p-2   tablet:w-12 mobile:w-screen ${isOpen ? 'mobile:h-[100px] min-w-64 z-50' : 'mobile:h-screen '}  w-64 text-slate-700  bg-white shadow-md h-screen gap-6 relative  flex flex-col justify-start overflow-x-hidden `}
            >
                <NoSSR isOpen={isOpen} controls={controls} onClickHandler={onClickHandler} />
            </motion.aside>
            {isOpen && isTablet && (
                <div className="w-full h-screen opacity-75 bg-black absolute" onClick={onClickHandler} />
            )}
        </>
    )
}

export default NavigationSidebar
