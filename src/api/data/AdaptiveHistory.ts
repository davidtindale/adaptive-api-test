import { Command } from "./Command"
import { Tag } from "./Tag"

export interface AdaptiveHistory {
    id: string
    start: number
    end: number
    elapsedTimes: number[]
    tags: HistoryTag[]
    commands?: Command[]
}


export interface HistoryTag extends Tag {
    elapsedIndexes: number[]
    values: unknown[]
}


/**
 * The JSON on the wire is in a smaller form that we fix here.
 */
export function fixHistory(history: AdaptiveHistory) {
    history.start = new Date(history.start).valueOf()
    history.end = new Date(history.end).valueOf()
    let prev = 0, prevDelta = 0
    const elapsedTimes = history.elapsedTimes
    for (let i = 0; i !== elapsedTimes.length; i++) {
        const delta = prevDelta + elapsedTimes[i]
        prevDelta = delta
        const value = prev + delta
        prev = value
        elapsedTimes[i] = value
    }

    for (const tag of history.tags) {

        // TODO: remove this
        if (tag.trace && !tag.trace.sets) {
            if (tag.name.includes('Temp'))
                tag.trace.sets = ['Temperatures']
            else if (tag.name.includes('Level'))
                tag.trace.sets = ['Levels']
            else if (tag.name.includes('Flow'))
                tag.trace.sets = ['Flow']
        }



        let prev = 0
        const elapsedIndexes = tag.elapsedIndexes
        for (let i = 0; i !== elapsedIndexes.length; i++) {
            const value = prev + elapsedIndexes[i]
            prev = value
            elapsedIndexes[i] = value
        }

        const values = tag.values
        if (tag.type === 'number') {
            let prev = 0
            for (let i = 0; i !== values.length; i++) {
                const value = prev + (values[i] as number)
                prev = value
                values[i] = value
            }
        } else if (tag.type === 'boolean') {
            if (values.length) {
                let prev = values[0] as boolean
                for (let i = 1; i !== elapsedIndexes.length; i++) {
                    prev = !prev
                    values[i] = prev
                }
            }
        }
    }
}

