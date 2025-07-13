'use client'

import dynamic from 'next/dynamic'
import React, {useEffect, useState} from 'react'

import {motion, useAnimationControls} from 'motion/react'

import useLayout from '@/hooks/use-layout'

import {widthAnimation} from './util/motion-variants'

const NoSSR = dynamic(() => import('./client-sidebar'), {ssr: false})

const NavigationSidebar = () => {
    const [isClose, setIsClose] = useState(true)

    const controls = useAnimationControls()

    const isTablet = useLayout('tablet')

    useEffect(() => {
        if (isTablet) {
            setIsClose(false)
            controls.start('close')
        } else {
            setIsClose(true)
            controls.start('open')
        }
    }, [isTablet, controls])

    useEffect(() => {
        if (isClose) {
            controls.start('open')
        } else {
            controls.start('close')
        }
    }, [controls, isClose])

    return (
        <motion.aside
            layout
            variants={widthAnimation}
            animate={controls}
            aria-label="사이드바 네비게이션"
            className={` p-2 tablet:w-12  w-64 text-slate-700 bg-white shadow-md h-screen gap-6 sticky  flex flex-col justify-start overflow-x-hidden`}
        >
            <NoSSR isClose={isClose} controls={controls} setIsClose={setIsClose} />
        </motion.aside>
    )
}

export default NavigationSidebar
