'use client'

import {AnimatePresence} from 'motion/react'

import {useModalStore} from '@/store/use-modal-store'

export default function ModalProvider() {
    const {currentModal: modal} = useModalStore()

    return (
        <div className={`fixed inset-0 ${modal ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <AnimatePresence>{modal}</AnimatePresence>
        </div>
    )
}
