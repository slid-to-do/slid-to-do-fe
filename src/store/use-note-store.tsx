import type {SelectedNoteStore} from '@/types/store'
import {create} from 'zustand'

export const useSelectedNoteStore = create<SelectedNoteStore>((set) => ({
    selectedNoteId: null,
    setSelectedNoteId: (id) => set({selectedNoteId: id}),
}))
