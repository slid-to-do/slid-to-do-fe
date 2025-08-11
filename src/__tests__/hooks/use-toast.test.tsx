import {renderHook, act} from '@testing-library/react'
import {toast} from 'react-toastify'

import useToast from '../../hooks/use-toast'

type ToastFunctionMock = jest.Mock & {
    clearWaitingQueue: jest.Mock
    dismiss: jest.Mock
    isActive: jest.Mock
    info: jest.Mock
    success: jest.Mock
    error: jest.Mock
    warning: jest.Mock
}

jest.mock('react-toastify', () => {
    const mockToast = jest.fn() as ToastFunctionMock
    mockToast.clearWaitingQueue = jest.fn()
    mockToast.dismiss = jest.fn()
    mockToast.isActive = jest.fn()
    mockToast.info = jest.fn()
    mockToast.success = jest.fn()
    mockToast.error = jest.fn()
    mockToast.warning = jest.fn()
    return {toast: mockToast}
})

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/test-path'),
}))

describe('useToast hook', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('마운트되거나 pathname이 변경될 때 토스트 대기열을 비운다', () => {
        renderHook(() => useToast())
        expect(toast.clearWaitingQueue).toHaveBeenCalledTimes(1)
    })

    it('기본 타입의 토스트를 표시한다', () => {
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.showToast('Hello')
        })
        expect(toast).toHaveBeenCalledWith('Hello', {toastId: undefined, position: 'top-center'})
    })

    it('타입이 "none"일 때 아이콘 없이 토스트를 표시한다', () => {
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.showToast('No icon', {type: 'none'})
        })
        expect(toast).toHaveBeenCalledWith('No icon', {toastId: undefined, position: 'top-center', icon: false})
    })

    it('타입이 "success"일 때 성공 토스트를 표시한다', () => {
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.showToast('Success!', {type: 'success'})
        })
        expect(toast.success).toHaveBeenCalledWith('Success!', {toastId: undefined, position: 'top-center'})
    })

    it('id가 이미 활성 상태일 경우 토스트를 표시하지 않는다', () => {
        ;(toast.isActive as jest.Mock).mockReturnValue(true) // ← 여기
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.showToast('Already active', {id: '123'})
        })
        expect(toast).not.toHaveBeenCalledWith('Already active', expect.anything())
    })

    it('id를 지정하여 토스트를 닫는다', () => {
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.dismissToast('toast-id')
        })
        expect(toast.dismiss).toHaveBeenCalledWith('toast-id')
    })

    it('id를 지정하지 않으면 모든 토스트를 닫는다', () => {
        const {result} = renderHook(() => useToast())
        act(() => {
            result.current.dismissToast()
        })
        expect(toast.dismiss).toHaveBeenCalled()
    })
})
