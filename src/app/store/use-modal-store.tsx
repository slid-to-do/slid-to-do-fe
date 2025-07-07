import {create} from 'zustand'

import type {JSX} from 'react'

interface ModalState {
    currentModal: JSX.Element | undefined
    setModal: (modal: JSX.Element) => void
    clearModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
    currentModal: undefined,
    setModal: (modal: JSX.Element) => set(() => ({currentModal: modal})),
    clearModal: () => set({currentModal: undefined}),
}))
