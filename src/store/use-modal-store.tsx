import {create} from 'zustand'

import type {JSX} from 'react'

import type {ModalState} from '@/types/store'

export const useModalStore = create<ModalState>((set) => ({
    currentModal: undefined,
    setModal: (modal: JSX.Element) => set(() => ({currentModal: modal})),
    clearModal: () => set({currentModal: undefined}),
}))
