import type {JSX} from 'react'

export interface ModalState {
  currentModal: JSX.Element | undefined
  setModal: (modal: JSX.Element) => void
  clearModal: () => void
}