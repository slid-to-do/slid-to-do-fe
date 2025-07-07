// /mock/data.ts

export interface Item {
    uid: number
    title: string
}

export const mockItems: Item[] = Array.from({length: 100}, (_, i) => ({
    uid: i + 1,
    title: `항목 ${i + 1}`,
}))
