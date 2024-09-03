import { fetchBlob as fetchBlob0, fetchT as fetchT0, tk, url8 } from '../apiToken'
import { LiveMachines, ScreenButton, ProgramGroup, RunningProfile, HistoryOptions, ScheduledJob } from './apiLiveData'
import { AdaptiveHistory, fixHistory } from '../data/AdaptiveHistory'
import { Tag } from '../data/Tag'
import { createSignal } from 'solid-js'
import { Command } from '../data/Command'

export interface TokenAndMachine {
    server: string
    token: string
    machine: string
    // name?: string
}

export interface TokenAndMachines {
    server: string
    token: string
    machines: string[]
}

export interface DataPerMachine<T> {
    [machine: string]: T
}

export interface TagAndValue {
    tag: string
    value: unknown
}

export function endPointName(server: string, machine: string) {
    const s = machine
    const f = s.lastIndexOf('.')
    return f === -1 ? s : s.substring(f + 1)
    // return tokenAndMachine.name ?? tokenAndMachine.tag ?? server
}

function url0(server: string, path: string) {
    return url8(server, 'live', path)
}

function fetchT<T>(server: string, token: string, path: string, query?: any, setAbort?: (abort: () => void) => void) {
    return fetchT0<T>(url0(server, path), token, { ...query }, setAbort)
}

function fetchBlob(server: string, token: string, path: string, query?: any) {
    return fetchBlob0(url0(server, path), token, { ...query })
}

// function putTStringify<T>(server: string, token: string, path: string, body: any, query?: any) {
//     return putTStringify0<T>(url0(server, path), token, body, { ...query })
// }

// function plus(values: string[]) {
//     return values.length !== 0 ? values.join("+") : undefined
// }

function fetchTM<T>(server: string, token: string, machines: string[], path: string, query?: any, setAbort?: (abort: () => void) => void) {
    return fetchT<T>(server, token, path, { m: machines, ...query }, setAbort)
}

// function fetchTL<T>(server: string, token: string, machine: string, path: string, query?: any, setAbort?: (abort: () => void) => void) {
//     return fetchT<T>(server, token, path, { ...query, m: machine }, setAbort)
// }

function fetchBlobL(server: string, token: string, machine: string, path: string, query?: any) {
    return fetchBlob(server, token, path, { ...query, m: machine })
}

// function putTMStringify<T>(server: string, token: string, machines: string[], path: string, body: any, query?: any) {
//     return putTStringify<T>(server, token, path, body, { ...query, m: machines })
// }

// function putTLStringify<T>(server: string, token: string, machine: string, path: string, body: any, query?: any) {
//     return putTStringify<T>(server, token, path, body, { ...query, m: machine })
// }

export function fetchLiveMachines(server: string, token: string, setAbort?: (abort: () => void) => void) {
    return fetchT<LiveMachines>(server, token, 'liveMachines', undefined, setAbort)
}

// TODO: if an enum value, then the 'any' would be { value: number, text: string }>
export function fetchTagValuesMultiple(server: string, token: string, machines: string[], tags: string[], setAbort?: (abort: () => void) => void) {
    return fetchTM<DataPerMachine<unknown[]>>(server, token, machines, 'tagValues', { q: tags }, setAbort)
}

export function fetchTagValues(server: string, token: string, machine: string, tags: string[], setAbort?: (abort: () => void) => void) {
    return unPlural(fetchTagValuesMultiple(server, token, [machine], tags, setAbort))
}

// export function setTagValues(server: string, token: string, machine: string, ...tagAndValues: TagAndValue[]) {
//     return putTStringify(server, token, 'setTagValues', tagAndValues, { m: machine })
// }

// export function fetchJob(server: string, token: string, options: {
//     id: unknown
// }) {
//     return fetchT<ScheduledJob>(server, token, 'job', options)
// }

// export function insertJob(server: string, token: string, machine: string, inserts: unknown | unknown[]) {
//     return putTLStringify(server, token, machine, 'insertJob', inserts)
// }

// export function updateJob(server: string, token: string, machine: string, updates: unknown | unknown[]) {
//     return putTLStringify(server, token, machine, 'updateJob', updates)
// }

// export function deleteJob(server: string, token: string, machine: string, ids: unknown | unknown[]) {
//     return putTLStringify(server, token, machine, 'deleteJob', ids)
// }

export function fetchTagsMultiple(server: string, token: string, machines: string[]) {
    return fetchTM<DataPerMachine<Tag[]>>(server, token, machines, 'tags')
}

export function fetchTags(server: string, token: string, machine: string) {
    return unPlural(fetchTagsMultiple(server, token, [machine]))
}

export function fetchCommandsMultiple(server: string, token: string, machines: string[]) {
    return fetchTM<DataPerMachine<Command[]>>(server, token, machines, 'commands')
}

export function fetchCommands(server: string, token: string, machine: string) {
    return unPlural(fetchCommandsMultiple(server, token, [machine]))
}

export function urlCommandIcon(server: string, machine: string, command: string) {
    return url0(server, 'commandIcon') + `?m=${machine}&c=${command}`
}

export async function fetchDashboardBytes(server: string, token: string, machine: string) {
    return (await fetch(url0(server, 'dashboard') + `?m=${machine}`, tk(token))).arrayBuffer()
}

export async function fetchSceneBytes(server: string, token: string, machine: string) {
    return (await fetch(url0(server, 'scene') + `?m=${machine}`, tk(token))).arrayBuffer()
}

export function fetchScreenButtonsMultiple(server: string, token: string, machines: string[]) {
    return fetchTM<DataPerMachine<ScreenButton[]>>(server, token, machines, 'screenButtons')
}

export function fetchProgramGroupsMultiple(server: string, token: string, machines: string[], options: {
    group?: string | string[],
    onlyStepCounts?: boolean
} = {}) {
    // if (q.length !== 0)
    //     url += '?' + q.map(x => x.split('&').join('%26')).join('&')
    return fetchTM<DataPerMachine<ProgramGroup[]>>(server, token, machines, 'programs', options)
}

export function fetchProgramGroups(server: string, token: string, machine: string, options: {
    group?: string | string[],
    onlyStepCounts?: boolean
} = {}) {
    return unPlural(fetchProgramGroupsMultiple(server, token, [machine], options))
}


export async function fetchJobsMultiple(server: string, token: string, machines: string[]) {
    const ret = await fetchTM<{ [machine: string]: ScheduledJob[] }>(server, token, machines, 'jobs')
    Object.values(ret).forEach(jobs => jobs.forEach(job => {
        job.start = new Date(job.start as any).valueOf()
        job.end = new Date(job.end as any).valueOf()
    }))
    return ret
}

export function fetchJobs(server: string, token: string, machine: string) {
    return unPlural(fetchJobsMultiple(server, token, [machine]))
}

export function fetchMessagesMultiple(server: string, token: string, machines: string[]) {
    return fetchTM<DataPerMachine<string[]>>(server, token, machines, 'messages')
}

export function fetchMessages(server: string, token: string, machine: string) {
    return unPlural(fetchMessagesMultiple(server, token, [machine]))
}


export async function unPlural<T>(promise: Promise<DataPerMachine<T>>): Promise<T> {
    const ret = Object.values(await promise)[0]
    if (ret === undefined)
        throw new Error('No data')
    return ret
}

export function fetchScreenButtons(server: string, token: string, machine: string) {
    return unPlural(fetchScreenButtonsMultiple(server, token, [machine]))
}


export function fetchProfiles(server: string, token: string, machines: string[]) {
    return fetchTM<DataPerMachine<RunningProfile | null>>(server, token, machines, 'profiles')
}


// Handy utility for representing a date
function date(value: number | Date | undefined) {
    if (value !== undefined) {
        let s: string
        if (typeof value === 'number')
            s = value.toString()
        else {
            s = value.toISOString()
            //   s = s.substring(0, s.length - 5) + 'Z'  // remove the milliseconds
        }
        return s
    }
}

export async function fetchHistoryMultiple(server: string, token: string,
    machinesAndOptions: { machine: string, options?: HistoryOptions }[]) {

    // Need to build quite a complicated query string
    function valueInCommon<T>(values: T[]): [boolean, T] {
        if (values.length) {
            const first = values[0]
            if (values.every(v => v === first))
                return [true, first]
        }
        return [false, undefined as T]
    }
    const startValues = machinesAndOptions.map(({ options }) => options?.start)
    const [startInCommon, value] = valueInCommon(startValues)
    const start = !startInCommon ? startValues.map(date) : date(value)
    const endValues = machinesAndOptions.map(({ options }) => options?.end)
    const [endInCommon, value2] = valueInCommon(endValues)
    const end = !endInCommon ? endValues.map(date) : date(value2)
    const tagsFilterValues = machinesAndOptions.map(({ options }) => options?.tagsFilter)
    const [tagsFilterInCommon, value3] = valueInCommon(tagsFilterValues)
    const tagsFilter = !tagsFilterInCommon ? tagsFilterValues : value3
    const valuesOnlyIdValues = machinesAndOptions.map(({ options }) => options?.valuesOnlyId)
    const [valuesOnlyIdInCommon, value4] = valueInCommon(valuesOnlyIdValues)
    const valuesOnlyId = !valuesOnlyIdInCommon ? valuesOnlyIdValues : value4

    const query = { start, end, tagsFilter, valuesOnlyId }

    const ret = await fetchTM<DataPerMachine<AdaptiveHistory | null>>(
        server, token, machinesAndOptions.map(({ machine }) => machine), 'history', query)
    Object.values(ret).forEach(history => {
        if (history)
            fixHistory(history)
    })
    return ret
}

export function fetchHistory(server: string, token: string, machine: string, options?: HistoryOptions) {
    return unPlural(fetchHistoryMultiple(server, token, [{ machine, options }]))
}

export async function fetchOrUpdateHistoryMultiple(
    server: string, token: string,
    machinesCurrentAndOptions: {
        machine: string
        current: AdaptiveHistory | null | undefined
        options?: Omit<HistoryOptions, 'start' | 'end' | 'valuesOnlyId'>
    }[],
) {
    const histories = await fetchHistoryMultiple(server, token,
        machinesCurrentAndOptions.map(({ machine, options, current }) => ({
            machine,
            options: current ?
                { start: new Date(current.end), valuesOnlyId: current.id, ...options } :
                options
        }))
    )
    const ret: DataPerMachine<AdaptiveHistory | null> = {}
    Object.entries(histories).forEach(([machine, hNew]) => {
        ret[machine] = addHistoryChanges(machinesCurrentAndOptions.find(x => x.machine === machine)!.current, hNew)
    })
    return ret
}

/**
 * Updates an existing history if possible or otherwise fetches a new history.
 */
export function fetchOrUpdateHistory(
    server: string, token: string, machine: string,
    current: AdaptiveHistory | null | undefined,
    options?: Omit<HistoryOptions, 'start' | 'end' | 'valuesOnlyId'>
) {
    return unPlural(fetchOrUpdateHistoryMultiple(server, token, [{ machine, options, current }]))
}

function addHistoryChanges(current: AdaptiveHistory | null | undefined, hNew: AdaptiveHistory | null) {
    if (hNew === null)
        return null
    if (!current || hNew.id !== current.id) {
        // Just the right kind of signalling proxy for the update code below
        const [elapsedTimes, setElapsedTimes] = createSignal(hNew.elapsedTimes)
        const [end, setEnd] = createSignal(hNew.end)
        // Ought to also proxy up the tags, but there is enough signalling going on already...
        return new Proxy(hNew, {
            get: (target, prop, receiver) => {
                switch (prop) {
                    case 'end': return end()
                    case 'elapsedTimes': return elapsedTimes()
                    default: return Reflect.get(target, prop, receiver)
                }
            },
            set: (target, prop, value, receiver) => {
                switch (prop) {
                    case 'end': setEnd(value); return true
                    case 'elapsedTimes': setElapsedTimes(value); return true
                    default: return Reflect.set(target, prop, value, receiver)
                }
            }
        })
    }
    if (current.end === hNew.end)
        return current   // no change to existing history

    // Add some data
    current.elapsedTimes = [...current.elapsedTimes, ...hNew.elapsedTimes]
    const tags0Map = new Map(current.tags.map(t => [t.name, t]))
    hNew.tags.forEach(tag => {
        const t1 = tags0Map.get(tag.name)
        if (t1) { // should always be there...
            // TODO: should check we are not adding duplicate elapsed-times...
            t1.elapsedIndexes.push(...tag.elapsedIndexes)
            t1.values.push(...tag.values)
        }
    })
    current.end = hNew.end
    return current
}


export function urlHistoryAsFile(server: string, machine: string) {
    return url0(server, 'h.hst')
}

export async function fetchHistoryPdf(server: string, token: string, machine: string) {
    return fetchBlobL(server, token, machine, 'historyPdf')
}


export function fetchScreenMultiple(server: string, token: string, machines: string[], page?: number) {
    return fetchTM<DataPerMachine<string[]>>(server, token, machines, 'screen', { page })
}

export function fetchScreen(server: string, token: string, machine: string, page?: number) {
    return unPlural(fetchScreenMultiple(server, token, [machine], page))
}

// async function putRunningCommand(token: Token, machine: string, command: string, body?: string) {
//     return Object.values(await putTL<DataPerTag<RunningSteps>>(tokenAndMachine, command, body))[0]
// }

// export function putStepNumber(token: Token, machine: string, stepNumber: number) {
//     return putRunningCommand(tokenAndMachine, 'stepNumber', stepNumber.toString())
// }

// export function putRunning(token: Token, machine: string, running: Running) {
//     return putRunningCommand(tokenAndMachine, 'running', running.toString())
// }

// export function putBackward(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'backward')
// }

// export function putForward(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'forward')
// }

// export function putPause(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'pause')
// }

// export function putProceed(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'proceed')
// }

// export function putStop(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'stop')
// }

// export function putYes(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'yes')
// }

// export function putNo(token: Token, machine: string) {
//     return putRunningCommand(tokenAndMachine, 'no')
// }
