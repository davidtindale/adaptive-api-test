import { query } from "../apiSignIn"
import { fetchT as fetchT0, postT as postT0, url8 } from "../apiToken"
import { CodeAndName, Summary, Cross, Filter, Post, PostsResult, Team, TimeSlotSummary, TopicCodeAndName, Topics, CodeAndName2, Notification, Notifications } from "./apiTagData"

function url0(server: string, path: string) {
    return url8(server, 'tag', path)
}

function fetchT<T>(server: string, token: string, path: string, query?: any) {
    return fetchT0<T>(url0(server, path), token, { ...query })
}

// function putTStringify<T>(server: string, token: string, path: string, body: any, query?: any) {
//     return putTStringify0<T>(url0(server, path), token, body, { ...query })
// }

// function putT<T>(server: string, token: string, path: string, body: any, query?: any) {
//     return putT0<T>(url0(server, path), token, body, { ...query })
// }

function postT<T>(server: string, token: string, path: string, body: any, query?: any) {
    return postT0<T>(url0(server, path), token, body, { ...query })
}

export function setProfile(server: string, token: string, tag: string, image: any) {
    return postT<unknown>(server, token, 'setProfile', image, { tag })
}

export function setCover(server: string, token: string, tag: string, image: any) {
    return postT<unknown>(server, token, 'setCover', image, { tag })
}

export interface URLProfileOptions {
    size?: number
    alts?: boolean
}

export function urlProfile(server: string, tag: string, options: URLProfileOptions = {}) {
    return url0(server, 'profile') + query({ tag, ...options })
}

export interface URLCoverOptions {
    size?: number
    alts?: boolean
}

export function urlCover(server: string, tag: string, options: URLCoverOptions = {}) {
    return url0(server, 'cover') + query({ tag, ...options })
}

export interface URLAttachmentOptions {
    size?: number
}

export function urlAttachmentThumbnail(server: string, postId: string, index: number, options: URLAttachmentOptions = {}) {
    return url0(server, 'attachmentThumbnail') + query({ postId, index, ...options })
}

export function urlAttachment(server: string, postId: string, index: number, options: URLAttachmentOptions = {}) {
    return url0(server, 'attachment') + query({ postId, index, ...options })
}

export function urlCommentAttachment(server: string, id: string, index: number, options: URLAttachmentOptions = {}) {
    return url0(server, 'commentAttachment') + query({ id, index, ...options })
}

export interface JobSearchResult {
    id: unknown
}

export async function fetchMatchCodeOrName(server: string, token: string,
    options: {
        text: string,
        limit?: number
    }) {

    // return Promise.resolve([{topic: 'topic', code: 'code', name: 'name'}])
    const ret = await fetchT<TopicCodeAndName[]>(server, token, 'matchCodeOrName', options)
    fixMatchCodeOrNameDates(ret)
    return ret
}

export function fixMatchCodeOrNameDates(value: TopicCodeAndName[]) {
    value.forEach(v => {
        if (v.minDate)
            v.minDate = new Date(v.minDate).valueOf()
        if (v.maxDate)
            v.maxDate = new Date(v.maxDate).valueOf()
    })
}

interface FetchSummaryOptions extends Filter {
}

export async function fetchSummary(server: string, token: string, options: FetchSummaryOptions = {}) {
    // const p: string[] = []
    // if (options.filter)
    //     p.push(...filterAsParams(options.filter))
    const ret = await fetchT<Summary>(server, token, 'summary', isoDates(options))
    fixSummaryDates(ret)
    return ret
}


export async function fetchTagNameMultiple(server: string, token: string, tags: string[]) {
    return fetchT<string[]>(server, token, 'tagName', { tag: tags })
}

export async function fetchTagName(server: string, token: string, tag: string) {
    return (await fetchTagNameMultiple(server, token, [tag]))[0]
}

export interface CA {
    commentId: string
    index: number
}
export function fetchCommentAttachments(server: string, token: string, options: { tag: string}) {
    return fetchT<CA[]>(server, token, 'commentAttachments', options)
}

export function fixSummaryDates(summary: Summary) {
    const dates = summary.date
    if (dates) {
        dates.min = new Date(dates.min).valueOf()
        dates.max = new Date(dates.max).valueOf()
    }
}

// TODO: very like FetchPostsOptions
interface FetchCrossOptions extends Filter {
    topic1: string,
    topic2: string,
    tagValue?: string
}

export function fetchCross(server: string, token: string, options: FetchCrossOptions) {
    // const p = ['topic1=' + topic1, 'topic2=' + topic2]
    // if (tagValue.length !== 0)
    //     p.push('tagValue=' + tagValue)
    // p.push(...filterAsParams(filter))
    return fetchT<Cross[]>(server, token, 'cross', isoDates(options))
}

export interface FetchPostOptions {
    id: string
}

export async function fetchPost(server: string, token: string, options: FetchPostOptions) {
    const ret = await fetchT<Post | null>(server, token, 'post', options)
    if (ret)
        fixPostDates(ret)
    return ret
}

// project: {
//     tags: {
//         chemical : {
//             value: 1
//         }
//     }
// },

export interface FetchPostsOptions extends Filter {
    include?: string[]
    parts?: number

    limit?: number
    desc?: boolean
    offset?: number
    project?: unknown // a document like for MongoDb
}

export async function fetchPosts(server: string, token: string, options: FetchPostsOptions) {
    // pause for 2 seconds for debugging
    // console.log('fetchPosts')
    // await new Promise(resolve => setTimeout(resolve, 2000))

    const ret = await fetchT<PostsResult>(server, token, 'posts', isoDates(options))

    // // const t0 = performance.now()
    // // TODO: save 3ms on the UI thread by using a web-worker to run the fixPostDates loop
    // const ww = new Worker('')
    // // ww.postMessage()
    // const p = new Promise<void>((resolve, reject)=>{

    // })
    // await p

    ret.posts.forEach(post => fixPostDates(post))


    // console.log(performance.now() - t0)  

    return ret
}


export function fixPostDates(post: Post) {
    post.date = new Date(post.date).valueOf()
    if (post.until)
        post.until = new Date(post.until).valueOf()
}

interface FetchTopicsOptions extends Filter {
    // joins?: string[]
    // ifUpdatedAfter?: number
    lastPost?: boolean
    // lastPostParts?: number
}
export function fetchTopics(server: string, token: string, options: FetchTopicsOptions = {}) {
    // const p: string[] = []
    // if (options.filter)
    //     p.push(...filterAsParams(options.filter))
    return fetchT<Topics>(server, token, 'topics', isoDates(options))
}



interface FetchTimeSlotSummaryOptions extends Filter {
    dates: number[]
}

export function fetchTimeSlotSummary(server: string, token: string, options: FetchTimeSlotSummaryOptions) {
    const { dates, ...other } = options
    // Make the dates shorter by removing the milliseconds, etc
    const dates2 = dates.map(ms =>
        ms % 1000 !== 0 ? ms :
            ms % 3600000 !== 0 ? ms / 1000 :
                ms / 3600000
    )
    // return dates2.join('&dates=').length <= 300 ?
    //     fetchT<TimeSlotSummary>(server, token, 'timeSlotSummary', { ...other, dates: dates2 }) :
    //     putTStringify<TimeSlotSummary>(server, token, 'timeSlotSummary', dates2, other)
}

interface FetchCodesOptions extends Filter {
    topic: string,
    limit?: number,
    code0?: string
}

export interface CodesResult {
    codes: CodeAndName2[]
    others?: { count: number, summary: Summary }
}

export function fetchCodes(server: string, token: string, options: FetchCodesOptions) {
    return fetchT<CodesResult>(server, token, 'codes', isoDates(options))
}

interface NotificationsResult {
    notifications: Notifications
}

export async function fetchNotifications(server: string, token: string) {
    // const ret = await fetchT<NotificationsResult>(server, token, 'notifications')
    // fixNotifications(ret.notifications)
    const ret = await fetchT<Notification[]>(server, token, 'notifications')
    ret.forEach(n => n.date = new Date(n.date).valueOf())  // fix the dates
    return ret
}

function fixNotifications(ns: Notifications) {
    ns.posts?.forEach(post => post.date = new Date(post.date).valueOf())
    ns.postNoteds?.forEach(({post}) => post.date = new Date(post.date).valueOf())
    ns.postComments?.forEach(({post, comment}) => {
        post.date = new Date(post.date).valueOf()
        comment.date = new Date(comment.date).valueOf()
    })
    
}

function joinParams(params: string[]) {
    return params.length === 0 ? '' : '?' + params.join('&')
}

function isoDates(options?: Filter) {
    if (!options)
        return options
    if (!options.after && !options.before)
        return options
    const ret: any = { ...options }
    if (options.after)
        ret.after = new Date(options.after)
    if (options.before)
        ret.before = new Date(options.before)
    return ret
}


export function fetchTeams(server: string, token: string) {
    return fetchT<Team[]>(server, token, 'teams')
}

export function addTeamFollowsTag(server: string, token: string, team: string, tag: string) {
    return postT(server, token, 'addTeamFollowsTag', undefined, { team, tag })
}

// Returns the id of the new post
export function addPost(server: string, token: string, content: String) {
    return postT<string>(server, token, 'addPost', content)
}

export function addPostAttachment(server: string, token: string, postId: string, blob: any) {
    return postT(server, token, 'addPostAttachment', blob, { postId })
}


// Returns the id of the new comment
export function addComment(server: string, token: string, postId: string, content: String) {
    return postT<string>(server, token, 'addComment', content, { postId })
}

export function addCommentAttachment(server: string, token: string, id: string, blob: any) {
    return postT(server, token, 'addCommentAttachment', blob, { id })
}

export function deleteComment(server: string, token: string, id: string) {
    return postT(server, token, 'deleteComment', undefined, { id })
}

export function addNote(server: string, token: string, postId: string) {
    return postT(server, token, 'addNote', undefined, { postId })
}

export function deleteNote(server: string, token: string, postId: string) {
    return postT(server, token, 'deleteNote', undefined, { postId })
}

export function addCommentNote(server: string, token: string, id: string) {
    return postT(server, token, 'addCommentNote', undefined, { id })
}

export function deleteCommentNote(server: string, token: string, id: string) {
    return postT(server, token, 'deleteCommentNote', undefined, { id })
}

// export function addAttachmentNote(server: string, token: string, postId: string, index: number) {
//     return postT(server, token, 'addAttachmentNote', undefined, { postId, index })
// }

// export function deleteAttachmentNote(server: string, token: string, postId: string, index: number) {
//     return postT(server, token, 'deleteAttachmentNote', undefined, { postId, index })
// }
