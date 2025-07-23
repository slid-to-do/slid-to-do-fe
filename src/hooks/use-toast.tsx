'use client'

import {useEffect} from 'react'
import {toast, ToastOptions, ToastPosition, Id as ToastId, ToastContent, TypeOptions} from 'react-toastify'
import {usePathname} from 'next/navigation'

type ToastType = TypeOptions | 'none'

interface ShowToastOptions {
    id?: ToastId
    type?: ToastType
    position?: ToastPosition
}

const useToast = () => {
    const pathname = usePathname()

    useEffect(() => {
        toast.clearWaitingQueue()
    }, [pathname])

    const showToast = (content: ToastContent, options: ShowToastOptions = {}) => {
        const {id, type = 'default', position = 'bottom-center'} = options
        const common: ToastOptions = {toastId: id, position}

        if (type === 'none') {
            toast(content, {...common, icon: false})
        } else if (type === 'default') {
            toast(content, common)
        } else {
            /**
             * `type`에 따라 toast 스타일과 아이콘이 달라집니다.
             *
             * - `'info'`: 파란색 정보 아이콘과 함께 표시됩니다.
             * - `'success'`: 녹색 체크 아이콘과 함께 표시됩니다.
             * - `'error'`: 빨간 느낌표 아이콘과 함께 표시됩니다.
             * - `'warning'`: 노란 경고 아이콘과 함께 표시됩니다.
             */
            toast[type](content, common)
        }
    }

    const dismissToast = (id?: ToastId) => {
        if (id) toast.dismiss(id)
        else toast.dismiss()
    }

    return {
        showToast,
        dismissToast,
    }
}

export default useToast
