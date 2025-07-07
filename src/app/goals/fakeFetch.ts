import {mockItems, Item} from './mock/data'

export const fakeFetch = (
    cursor: number,
    limit: number,
): Promise<{
    list: Item[]
    nextCursor: number | null
}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const start = cursor
            const end = start + limit
            const sliced = mockItems.slice(start, end)
            const next = end < mockItems.length ? end : null
            resolve({
                list: sliced,
                nextCursor: next,
            })
        }, 500)
    })
}
