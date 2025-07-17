'use client'

import React, {useEffect, useState} from 'react'
import CircleProgress from './circle-progress'
import Image from 'next/image'
import {animate, useMotionValue, useTransform, motion} from 'framer-motion'

const Progress = () => {
    const [progressReset, setProgressReset] = useState<boolean | null>(null)
    const count = useMotionValue<number>(0)
    const rounded = useTransform(count, (latest) => Math.floor(latest))

    // const progress = useMotionValue(0)
    // const animatedOffset = useTransform(progress, (p) => circumference * (1 - p))

    useEffect(() => {
        const controls = animate(count, 100, {duration: 1.0})
        console.log(progressReset)
        return () => controls.stop()
    }, [progressReset])

    const onClickReset = () => {
        if (progressReset !== null) {
            setProgressReset(!progressReset)
        } else {
            setProgressReset(true)
        }
    }

    return (
        <div className="flex p-6 w-full bg-custom_blue-500 relative justify-between rounded-lg min-w-86 max-w-120 max-h-63">
            <div className="flex flex-col">
                <button onClick={onClickReset}>버튼</button>
                <span className=" text-white text-title-xl font-extrabold">내 진행 상황</span>
                <div className="flex gap-1 text-white text-[30px] items-center  font-extrabold">
                    <motion.pre>{rounded}</motion.pre>
                    <span className="text-body font-extrabold">%</span>
                </div>
            </div>
            <CircleProgress percent={45} reset={progressReset} />

            <Image
                src={'./dashboard/opacity_circle.svg'}
                width={50}
                height={50}
                alt="opacity_circle "
                className="w-30 h-30 absolute bottom-0 right-0 z-0"
            />
        </div>
    )
}

export default Progress
