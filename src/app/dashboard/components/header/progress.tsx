'use client'

import Image from 'next/image'
import React from 'react'

import {animate, useMotionValue, useTransform, motion} from 'framer-motion'

const svgSize = 120
const stroke = 30
const radius = svgSize / 2 - stroke / 2
const circumference = 2 * Math.PI * radius
const animationDuration = 1

const Progress = ({percent = 0}: {percent: number | undefined}) => {
    const circleOffset = useMotionValue(circumference)
    const countValue = useMotionValue(0)
    const rounded = useTransform(countValue, (latest) => Math.floor(latest))

    const countControls = animate(countValue, percent, {duration: 1})
    const circleControls = animate(circleOffset, circumference * (1 - percent / 100), {
        duration: 1,
        ease: 'easeOut',
    })

    const handleStart = () => {
        countValue.set(0)
        circleOffset.set(0)
        countControls.play()
        circleControls.play()
    }
    return (
        <div className="flex  p-6 w-full h-[200px] bg-custom_blue-500 relative justify-between rounded-lg min-w-68 max-w-120 max-h-63">
            <div className="flex flex-col gap-2">
                <button onClick={handleStart}>
                    <Image src={'./dashboard/animation.svg'} alt="애니메이션 버튼" width={30} height={30} />
                </button>
                <span className=" text-white text-title-xl font-extrabold">내 진행 상황</span>
                <div className="flex gap-1 text-white text-[30px] items-center  font-extrabold">
                    <motion.pre>{rounded}</motion.pre>
                    <span className="text-body font-extrabold">%</span>
                </div>
            </div>
            <div className="w-auto h-full flex items-center justify-center relative z-10">
                <svg height={svgSize} width={svgSize}>
                    <g transform={`scale(-1 1) translate(-${svgSize} 0)`}>
                        <circle
                            stroke="#ffffff"
                            fill="transparent"
                            strokeWidth={stroke}
                            r={radius}
                            cx={svgSize / 2}
                            cy={svgSize / 2}
                        />

                        <motion.circle
                            stroke="#1E293B"
                            fill="transparent"
                            strokeWidth={stroke + 1}
                            strokeLinecap="butt"
                            r={radius}
                            cx={svgSize / 2}
                            cy={svgSize / 2}
                            strokeDasharray={circumference}
                            strokeDashoffset={circleOffset}
                            transition={{duration: animationDuration, ease: 'easeOut'}}
                            transform={`rotate(-90 ${svgSize / 2} ${svgSize / 2})`}
                        />
                    </g>
                </svg>
            </div>

            <Image
                src={'./dashboard/opacity-circle.svg'}
                width={50}
                height={50}
                alt="opacity_circle "
                priority
                className="w-30 h-30 absolute bottom-0 right-0 z-0"
            />
        </div>
    )
}

export default Progress
