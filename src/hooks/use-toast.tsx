'use client'

import {usePathname} from 'next/navigation'
import {useEffect} from 'react'

import {toast} from 'react-toastify'

import type {ToastOptions, ToastPosition, Id as ToastId, ToastContent, TypeOptions} from 'react-toastify'

type ToastType = TypeOptions | 'none'

interface ShowToastOptions {
    id?: ToastId
    type?: ToastType
    position?: ToastPosition
}

/**
 * `type`에 따라 toast 스타일과 아이콘이 달라집니다.
 *
 * - `'info'`: 파란색 정보 아이콘과 함께 표시됩니다.
 * - `'success'`: 녹색 체크 아이콘과 함께 표시됩니다.
 * - `'error'`: 빨간 느낌표 아이콘과 함께 표시됩니다.
 * - `'warning'`: 노란 경고 아이콘과 함께 표시됩니다.
 */
const showToastImpl = (content: ToastContent, options: ShowToastOptions = {}) => {
    const {id, type = 'default', position = 'bottom-center'} = options

    toast.clearWaitingQueue()
    if (id && toast.isActive(id)) {
        return
    }

    const common: ToastOptions = {toastId: id, position}
    if (type === 'none') {
        toast(content, {...common, icon: false})
    } else if (type === 'default') {
        toast(content, common)
    } else {
        toast[type](content, common)
    }
}

const dismissToastImpl = (id?: ToastId) => {
    if (id) toast.dismiss(id)
    else toast.dismiss()
}

const useToast = () => {
    const pathname = usePathname()

    useEffect(() => {
        toast.clearWaitingQueue()
    }, [pathname])

    return {
        showToast: showToastImpl,
        dismissToast: dismissToastImpl,
    }
}

export default useToast
