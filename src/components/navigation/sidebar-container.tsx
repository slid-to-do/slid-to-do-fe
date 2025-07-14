'use client'

import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react'

import {motion, useAnimationControls} from 'motion/react'

import useLayout from '@/hooks/use-layout'

import {widthAnimation, mobileAnimation} from './util/motion-variants'

const NoSSR = dynamic(() => import('./components/client-sidebar'), {ssr: false})

const NavigationSidebar = () => {
    const [isClose, setIsClose] = useState(true)

    const controls = useAnimationControls()

    const isTablet = useLayout('tablet')
    const isMobile = useLayout('mobile')

    useEffect(() => {
        if (isTablet) {
            setIsClose(false)
            console.log('open', isMobile, isTablet)
            controls.start('close')
        } else if (isMobile && !isTablet) {
            console.log('mobile', isMobile, isTablet)
            controls.start('mobile')
        } else if (!isMobile || !isTablet) {
            setIsClose(true)
            console.log('close', isMobile, isTablet, window.innerWidth)
            controls.start('open')
        }
    }, [isTablet, isMobile, controls])

    return (
        <>
            <motion.aside
                layout
                variants={widthAnimation}
                animate={controls}
                aria-label="사이드바 네비게이션"
                className={` p-2 tablet:w-12 mobile:w-screen mobile:h-[100px]  w-64 text-slate-700 bg-white shadow-md h-screen gap-6  fixed  flex flex-col justify-start overflow-x-hidden `}
            >
                <NoSSR isClose={isClose} controls={controls} setIsClose={setIsClose} />
            </motion.aside>
        </>
    )
}

export default NavigationSidebar
