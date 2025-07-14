'use client'

import {useEffect} from 'react'

import {motion, useAnimation} from 'framer-motion'

import type {GoalProgress} from '@/types/goals'

export default function ProgressBar({progress}: GoalProgress) {
    const controls = useAnimation()

    useEffect(() => {
        controls.start({
            scaleX: progress,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        })
    }, [progress, controls])

    return (
        <div className="flex gap-4 items-center">
            <div className="bg-custom_slate-50 overflow-hidden rounded-sm h-1 w-full">
                <motion.div initial={{scaleX: 0}} animate={controls} className="h-full bg-black origin-left" />
            </div>
            <div className="flex-shrink font-semibold text-subBody">{progress * 100}%</div>
        </div>
    )
}
