'use client'

import Image from 'next/image'
import {useEffect, useState} from 'react'

import {motion, AnimatePresence} from 'framer-motion'

interface ToastProperty {
    message: string
    onClose: () => void
}

const NoteSaveToast = ({message, onClose}: ToastProperty) => {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!isVisible) {
            const timeout = setTimeout(() => {
                onClose()
            }, 200)

            return () => clearTimeout(timeout)
        }
    }, [isVisible, onClose])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    transition={{duration: 0.2}}
                    className="bg-custom_blue-50 px-6 py-2 rounded-full flex gap-1 w-full"
                >
                    <Image src="/notes/ic-check.svg" alt="check" width={24} height={24} />
                    <div className="text-custom_blue-500 font-semibold">{message}</div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NoteSaveToast
