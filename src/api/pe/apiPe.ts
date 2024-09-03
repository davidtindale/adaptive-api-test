import { idToString } from '../../live/machine/PeDotNet/jobList/toKeyString'
import { fetchBlob as fetchBlob0, fetchT as fetchT0, tk, url8 } from '../apiToken'
import { AdaptiveHistory, fixHistory } from '../data/AdaptiveHistory'
import { ProgramGroup } from './apiPeData'

function url0(server: string, path: string) {
    return url8(server, 'pe', path)
}

function fetchT<T>(server: string, token: string, path: string, query?: any, setAbort?: (abort: () => void) => void) {
    return fetchT0<T>(url0(server, path), token, { ...query }, setAbort)
}

export function fetchProgramGroupNames(server: string, token: string) {
    return fetchT<string[]>(server, token, 'programGroupNames')
}

export function fetchProgramGroups(server: string, token: string, options?: {
    group?: string | string[],
    number?: string | string[],
    onlyStepCounts?: boolean
}) {
    return fetchT<ProgramGroup[]>(server, token, 'programGroups', options)
}


export async function fetchHistory(server: string, token: string, id: unknown) {
    const ret = await fetchT<AdaptiveHistory | null>(server, token, 'history', { id: idToString(id) })
    if (ret !== null)
        fixHistory(ret)
    return ret
}

export function fetchJobs<T>(server: string, token: string, options: {
    props?: string[]  // named props for which to return values
    id?: string[]  // constraint on 'id' - any one of these
    after?: number  // constraint on 'start'
    before?: number // constraint on 'start'
    // resource?: string[]
    // filter?: {}
    // findOptions?: FindOptions
} = {}) {

    return fetchT<T[]>(server, token, 'jobs', {
        ...options,
        after: options.after ? new Date(options.after) : undefined,
        before: options.before ? new Date(options.before) : undefined
    })
}

// export function insertJob(server: Server, inserts: unknown | unknown[]) {
//     return putT(server, 'insertJob', inserts)
// }

// export function updateJob(server: Server, updates: unknown | unknown[]) {
//     return putT(server, 'updateJob', updates)
// }

// export function deleteJob(server: Server, ids: unknown | unknown[]) {
//     return putT(server, 'deleteJob', ids)  // TODO: was previously a POST
// }

// export function fetchTimeSlotCount(server: Server, options: {
//     slots: number[],
// }) {
//     const { slots, ...other } = options
//     const slots2 = slots.map(ms =>
//         ms % 1000 !== 0 ? ms :
//             ms % 3600000 !== 0 ? ms / 1000 :
//                 ms / 3600000
//     )
//     // console.log(slots2)

//     return slots2.join('&slots=').length <= 300 ?
//         fetchT<TimeSlotCount>(server, 'timeSlotCount', { ...other, slots: slots2 }) :
//         putT<TimeSlotCount>(server, 'timeSlotCount', slots2, other)
// }

// export async function fetchTimeRange(server: Server, options: {
//     resources?: string[],
//     state?: number,
//     before?: number,
//     after?: number
// } = {}) {
//     const ret = await fetchT<TimeRange | null>(server, 'timeRange',
//         {
//             ...options,
//             before: options.before ? new Date(options.before) : undefined,
//             after: options.after ? new Date(options.after) : undefined
//         }
//     )
//     if (ret) {
//         ret.from = new Date(ret.from as any).valueOf()
//         ret.to = new Date(ret.to as any).valueOf()
//     }
//     return ret
// }



// export async function fetchTimeSlotMessageCountStart(server: Server, slots: Date[]) {
//     const ret = await putT<TimeSlotMessageCountResult[]>(
//         server,
//         'timeSlotMessageCountStart',
//         slots.map(d => d.toISOString())
//     )

//     ret.forEach(x => {
//         x.start = new Date(x.start)
//         x.end = new Date(x.end)
//     })
//     return ret
// }

// // export async function fetchSearch(server: string, text: string) {
// //     return (await (await fetch(url0(server, 'search') + `?text=${text}`)).json()) as SearchResult
// //     // return (await (await fetch(`${apiServer}/search?text=${text}`)).json()) as SearchResult
// // }


// // export async function fetchProgram(server: string, group: string, number: string) {
// //     const ret = (await (await fetch(programUrl(server, group, number))).json()) as Program
// //     if (ret.modifiedTime !== undefined)
// //         ret.modifiedTime = new Date(ret.modifiedTime)
// //     return ret
// // }


// // export function programUrl(server: Server, group: string, number: string) {
// //     return url0(server, 'program') + `?group=${group}&number=${number}`
// // }

// // export function programPdfUrl(server: string, group: string, number: string) {
// //     return url0(server, 'program.pdf') + `?group=${group}&number=${number}`
// // }

// // export function historyAsFileUrl(server: string, id: unknown) {
// //     return url0(server, 'history.hst') + `/${(id as any)[0]}@${(id as any)[1]}`
// //     //    return `${server}/api/history.hst?id=${JSON.stringify(id)}`
// // }

// // export function printHistoryUrl(server: string, id: unknown) {
// //     return url0(server, 'history.pdf') + `/${(id as any)[0]}@${(id as any)[1]}`
// // }


// // export function screenButtonUrl(server: string, image: string) {
// //     return url0(server, 'screenButtonImage') + `?image=${image}`
// // }


// interface FindOptions {
//     projection?: {}
// }

// // // a.k.a. AllSteps
// export function fetchExpandedProgramSteps(server: Server, options: {
//     group: string,
//     number: string
// }) {
//     return fetchT<ExpandedProgramSteps>(server, 'expandedProgramSteps', options)
// }



// export async function fetchTimelineTime(server: string, resource: string, time: Date, max: boolean) {
//     const ret = (await (await fetch(url0(server, 'timelineTime') + `?resource=${resource}&time=${time.toISOString()}&max=${max}`)).json()) as TimelineTime | null
//     if (ret !== null) {
//         ret.time = new Date(ret.time)  // convert from String to Date'
//     }
//     return ret
//     // return (await (await fetch(`${apiServer}/timelineTime?resource=${resource}&time=${time}&max=${max}`)).json()) as TimelineTime | null
// }




// export function fetchResourceGroups(server: Server) {
//     return fetchT<ResourceGroups>(server, 'resourceGroups')
// }


// // export async function fetchSimulatedTime(server: string) {
// //     return new Date(await (await fetch(`${server}/api/sim/time`)).json() as Date)
// // }

// export function fetchJobsVersion(server: Server) {
//     return fetchT<number>(server, 'jobsVersion')
// }
