import React, {act} from 'react'

import {renderHook} from '@testing-library/react'

import useModal from '@/hooks/use-modal'
import {useModalStore} from '@/store/use-modal-store'


jest.mock('@/store/use-modal-store', () => ({
    useModalStore: jest.fn(),
}))

const mockSetModal = jest.fn()
const mockClearModal = jest.fn()

beforeEach(() => {
    ;(useModalStore as unknown as jest.Mock).mockReturnValue({
        setModal: mockSetModal,
        clearModal: mockClearModal,
        currentModal: undefined,
    })
})

describe('useModal', () => {
    it('openModal 호출 시 setModal이 호출된다', () => {
        const TestModal = () => <div>테스트 모달</div>

        const {result} = renderHook(() => useModal(TestModal))

        act(() => {
            result.current.openModal()
        })
        expect(mockSetModal).toHaveBeenCalled()
    })

    it('closeModal 호출 시 clearModal이 호출된다', () => {
        const TestModal = () => <div>테스트 모달</div>
        const {result} = renderHook(() => useModal(TestModal))

        act(() => {
            result.current.closeModal()
        })
      
        expect(mockClearModal).toHaveBeenCalled()
        expect(mockSetModal.mock.calls[0][0].props.children.props.children.props.children.props.children).toEqual('테스트 모달')
    })
})

