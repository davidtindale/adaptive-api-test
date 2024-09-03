export interface Filter {
    tag?: string[]
    notTag?: string[]
    after?: number
    before?: number
    // fromLat?: number
    // fromLon?: number
    // toLat?: number
    // toLon?: number
    withAttachments?: boolean
}

export interface Post1 {
    content?: string
}

export interface Notification {
    date: number
    tag: { topic: string, code: string}
    tag0: { topic: string, code: string}
    postId: string
    content: string
}


export interface TopicAndLastPost {
    topic: string
    lastPost?: Post1
}
export interface Topics {
    serverTime: number
    topics: TopicAndLastPost[]
}

export type TimeSlotSummary = Summary[]

export interface QVals {
    count: number
    average: number
    min: number
    max: number
    q1: number
    median: number
    q3: number
}

export function QValSum(qval: QVals | undefined) {
    if (!qval)
        return undefined
    return qval.count * qval.average
}

export interface Summary {
    posts: number
    tagged?: number

    date?: QVals
    duration?: QVals
    value?: QVals
    unit?: string

    latitudeMin?: number
    latitudeMax?: number
    longitudeMin?: number
    longitudeMax?: number
    attachments?: number
}

export interface CrossA {
    topic: string
    code: string
    name?: string

    count: number,
    dates?: QVals
    durations?: QVals
    values?: QVals
    unit?: string
    specificValues?: QVals
    specificValueUnit?: string
}

export interface Cross {
    topic: string
    code: string
    name?: string
    tags: CrossA[]
}

export interface PostsResult {
    serverTime?: number
    posts: Post[]
}

// export interface CTag {
//     code: string
//     name?: string
//     value?: number
//     unit?: string
// }

// export interface Tags {
//     [key: string]: string | CTag  // either just the code, or full information
// }

export interface Tag {
    topic: string
    code: string
    name?: string
    value?: number
    unit?: string
}

export interface DateAndUntil0 {
    id?: string
    date: number
    until?: number
}

export interface DateAndUntil extends DateAndUntil0 {
    color?: string
    tags: Tag[]
}

export interface Notifications {
    // New posts, notified to us because we are following some tag in the post
    posts?: Post[]

    // New 'noted's of a post, notified to us because we are following some tag
    // in the post or because we are following the user that has noted
    postNoteds?: {
        post: Post
        notedBy: string  // e.g. user.dave@gmail.com
    }[]

    // New comments to a post, notified to us because we are following some tag
    // in the post or because we are following the user that has made the comment
    postComments?: {
        post: Post
        comment: Post
    }[]


    // notedPosts: {
    //     date: number
    //     postedBy: string
    //     tags: string[]
    //     content: string
    // }[]

    // notedComments: {
    //     date: number

    // }[]


    // comments: {

    // }[]

    // tagged: {

    // }[]


    // date: number
    // tag: { topic: string, code: string }
    // tag0: { topic: string, code: string }
    // postId: string
    // content: string
}

export interface Post {
    id?: string
    date: number
    content?: string
    tags: Tag[]

    until?: number
    color?: string

    // id?: string

    // deleted?: boolean
    // updated?: number
    // importance?: number
    // lat?: number
    // lon?: number
    // firstThumbnail?: any

    attachments?: Attachment[]

    noters?: Noter[]
    comments?: Comment[]

    // allComments?: DateContentAttachments[]
    // takers?: TagNameDate[]
    // notified?: string[]
}

export interface Attachment {
    mimeType: string
    hasThumbnail?: boolean
    noters?: Noter[]
    comments?: Comment[]
}

export interface Noter {
    date: number
    by: string
    name?: string
}

export function noterName(name: string | undefined, by: string) {
    if (name)
        return name
    let s = by
    if (s.startsWith("user.")) {
        s = s.substring(5)
        // Also remove anything after the @
        const f = s.indexOf("@")
        if (f !== -1)
            s = s.substring(0, f)
    }
    return s
}

export interface Comment {
    id: string
    date: number
    by: string
    name?: string
    content: string
    attachments?: Attachment[]
    noters?: Noter[]
}


export interface TagAndName {
    tag: string,
    name?: string
}

export interface TagNameDate extends TagAndName {
    date: number
}


export interface CodeAndName {
    code: string
    name?: string
}

export interface CodeAndName2 {
    code: string
    name?: string
    summary?: Summary
}

export interface TopicResult {
    topic: string
    tags: CodeAndName[]
}

export interface TopicCodeAndName {
    topic: string
    code?: string
    name?: string
    minDate?: number
    maxDate?: number
}

export type SearchResult = TopicResult[]

export interface Team {
    name: string
    members?: { tag: string, name?: string }[]
}

export function combineFilters(filter: Filter, subFilter: SubFilter) {
    const ent = Object.entries(subFilter)
    if (ent.length === 0)
        return filter

    const ret = { ...filter }
    ent.forEach(([topic, codes]) => {
        if (!codes.length)
            ret.notTag = [...(ret.notTag || []), topic]
        else {
            // TODO: filter.oneTag  not  filter.allTag
            ret.tag = [...(ret.tag || []), ...codes.map(code => topic + '.' + code)]
        }
    })
    return ret
}



export interface SubFilter {
    [key: string]: string[] // codes... empty for None, otherwise match any of the codes
}