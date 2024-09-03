import { createMemo } from "solid-js"
import { binarySearchLBound } from "../../utils/binarySearch"
import { AdaptiveHistory, HistoryTag } from "./AdaptiveHistory"
import { ParentProgram, PrefixedStep } from "./Step"
import { Trace } from "./Tag"
import createArrayMemo from "../../utils/createArrayMemo"

export function isHistory(value: any): value is AdaptiveHistory {
    return value?.id !== undefined
}

export function standardTraces(history: AdaptiveHistory) {
    return history!.tags.filter(tag => tag.trace) as (HistoryTag & { trace: Trace })[]
}

export function valueAtMs(tag: HistoryTag, elapsedTimes: number[], ms: number) {
    const idx1 = binarySearchLBound(elapsedTimes, x => x - ms)
    const idx = binarySearchLBound(tag.elapsedIndexes, x => x - idx1)
    return tag.values[idx]
}


export function createParentPrograms(
    history: () => { elapsedTimes: number[], tags: HistoryTag[] } | undefined,
    ms: () => number
) {
    // Get the final value of the Parent._Programs tag
    const tag = createMemo(() => history()?.tags.find(t => t.name === 'Parent._Programs'))
    const programs0 = createMemo(() => tag() ?
        (valueAtMs(tag()!, history()!.elapsedTimes, ms()) as ParentProgram[])
        : [])

    const programs = createMemo(() =>
        programs0().filter(p => p.number !== '0')  // number 0 is the parent dummy IP
            .sort((a, b) => {
                try {
                    return parseInt(a.number) - parseInt(b.number)
                } catch (e) {
                    return a.number.localeCompare(b.number)
                }
            })
    )
    return createArrayMemo(programs, (a, b) => a.number === b.number)
}


export function tagTimeInSteps2(tags: HistoryTag[] | undefined) {
    return tags?.find(t => t.name === 'Parent._TimeInSteps')
}

export function tagPrefixedSteps2(tags: HistoryTag[] | undefined) {
    return tags?.find(t => t.name === 'Parent._PrefixedSteps')
}

/**
 * @returns a RunningSteps-like object with reactive values
 */
export function createHistoryRunningSteps(
    history: () => { elapsedTimes: number[], tags: HistoryTag[] } | undefined,
    ms: () => number
) {
    const tagCurrentStep = createMemo(() => history()?.tags.find(t => t.name === 'Parent.CurrentStep'))
    const tagIsPaused = createMemo(() => history()?.tags.find(t => t.name === 'Parent.IsPaused'))
    const tagChangingStep = createMemo(() => history()?.tags.find(t => t.name === 'Parent.ChangingStep'))
    const tagPrefixedSteps = createMemo(() => tagPrefixedSteps2(history()?.tags))
    const tagTimeInSteps = createMemo(() => tagTimeInSteps2(history()?.tags))

    const currentStep = createMemo(() => tagCurrentStep() ? valueAtMs(tagCurrentStep()!, history()!.elapsedTimes, ms()) as number : 0)
    const paused = createMemo(() => tagIsPaused() ? valueAtMs(tagIsPaused()!, history()!.elapsedTimes, ms()) as boolean : false)
    const changingStep = createMemo(() => paused() && tagChangingStep() ? valueAtMs(tagChangingStep()!, history()!.elapsedTimes, ms()) as number : 0)

    // const steps = createArrayOfMutables(
    //     () => tagPrefixedSteps() ?
    //         valueAtMs(tagPrefixedSteps()!, elapsedTimes(), 0 // ms()
    //         ) as PrefixedStep[]
    //         : [],
    //     step => step.command ?? '' //  === b.command && step.text === b.text && step.notes === b.notes
    // )

    const steps = createMemo(
        () => tagPrefixedSteps() ?
            valueAtMs(tagPrefixedSteps()!, history()!.elapsedTimes, ms()) as PrefixedStep[]
            : [],
    )


    const timeInSteps = createMemo(() => tagTimeInSteps() ? valueAtMs(tagTimeInSteps()!, history()!.elapsedTimes, ms()) as (number | null)[] ?? [] : [])

    return {
        currentStep,
        paused,
        changingStep,
        steps,
        timeInSteps,
        programs : createParentPrograms(history, ms)
    }
}


export function trueTime(tag: HistoryTag, duration: number) {
    let ret = 0
    // let e0 = 0, lastV = false
    // tag.elapsedTimes.forEach((elapsed, index) => {
    //     const v = !!tag.values[index]
    //     if (e0 < elapsed && lastV)
    //         ret += elapsed - e0
    //     lastV = v
    //     e0 = elapsed
    // })
    // if (e0 < duration && lastV)
    //     ret += duration - e0
    return ret
}

export function actuationsLineData(tag: HistoryTag, elapsedTimes: number[]) {
    const ret: { start: number, end: number }[] = []
    const historyDuration = elapsedTimes[elapsedTimes.length - 1]
    let start = -1
    tag.elapsedIndexes.forEach((idx, i) => {
        if (tag.values[i]) {
            if (start === -1) {
                start = elapsedTimes[idx]
            }
        } else {
            if (start !== -1) {
                ret.push({ start, end: elapsedTimes[idx] })
                start = -1
            }
        }
    })
    if (start !== -1) {
        ret.push({ start, end: historyDuration })
    }
    return ret
}

// Needs to know the last element of elapsedTimes for values that endure to the end
export function actuationsLineData2<T = unknown>(tag: HistoryTag, elapsedTimes: number[]) {
    const ret: { value: T, start: number, end: number }[] = []
    const historyDuration = elapsedTimes[elapsedTimes.length - 1]

    let start = -1, lastValue: T | undefined = undefined
    tag.elapsedIndexes.forEach((idx, i) => {
        const value = tag.values[i]
        if (lastValue !== value) {
            const end = elapsedTimes[idx]
            if (start !== -1)
                ret.push({ value: lastValue!, start, end })
            lastValue = value as T
            start = end
        } else {
            if (start === -1) {
                start = elapsedTimes[idx]
            }
        }
    })
    if (start !== -1) {
        ret.push({ value: lastValue!, start, end: historyDuration })
    }
    return ret
}

export function actuationsData(tag: HistoryTag, elapsedTimes: number[]) {
    const historyDuration = elapsedTimes[elapsedTimes.length - 1]
    const lineData = actuationsLineData(tag, elapsedTimes)
    const duration = lineData.reduce((a, b) => a + b.end - b.start, 0)
    return {
        actuations: lineData.length,
        duration,
        dutyCycle: duration / historyDuration
    }
}


export function historyJob(history: AdaptiveHistory | null | undefined) {
    const values = history?.tags.find(t => t.name === 'Parent.Job')?.values
    if (!values)
        return ''
    return (values[values.length - 1] as string).trim()
}
