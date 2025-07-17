import {create} from 'zustand'

import type {ModalState} from '@/types/store'
import type {JSX} from 'react'

export const useModalStore = create<ModalState>((set) => ({
    currentModal: undefined,
    setModal: (modal: JSX.Element) => set(() => ({currentModal: modal})),
    clearModal: () => set({currentModal: undefined}),
}))
