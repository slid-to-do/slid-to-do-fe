'use client'

import {useEffect} from 'react'

import {motion, useAnimation} from 'framer-motion'

interface ProgressBarProperties {
    progress: number // 0~1 사이의 값
}

export default function ProgressBar({progress}: ProgressBarProperties) {
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
        <div className="bg-custom_slate-50 overflow-hidden rounded-sm h-1 w-full">
            <motion.div initial={{scaleX: 0}} animate={controls} className="h-full bg-black origin-left" />
        </div>
    )
}
