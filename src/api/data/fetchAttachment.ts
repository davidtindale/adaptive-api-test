import { AdaptiveHistory, fixHistory } from "./AdaptiveHistory"
import { tk } from "../apiToken"
import { URLAttachmentOptions, urlAttachment, urlCommentAttachment } from "../tag/apiTag"

interface Base {
    mimeType: string
}

interface HistoryBase {
    mimeType: 'application/hst+json'
    history: AdaptiveHistory
}

interface URLBase {
    mimeType: string
    url: string
}

export type AttachmentData = HistoryBase | URLBase

// Adds knowledge about AdaptiveHistory to fetching an attachment from tag world.
export default async function fetchAttachment(
    server: string, token: string, id: string, index: number,
    isComment: boolean,
    options: URLAttachmentOptions = {})
    : Promise<AttachmentData | null> {

    const response = await fetch((isComment ? urlCommentAttachment : urlAttachment)(server, id, index, options), tk(token))
    if (response.status === 204)
        return null  // no content

    const blob = await response.blob()

    if (blob.type === 'application/hst+json') {
        const history = JSON.parse(await blob.text()) as AdaptiveHistory
        fixHistory(history)
        return { mimeType: blob.type, history }
    }

    return { mimeType: blob.type, url: window.URL.createObjectURL(blob) }  // pdf, png, jpg, etc
    


    // if (mimeType === 'application/pdf') {
    //     const ret = window.URL.createObjectURL(await response.blob())
    //     console.log(ret)
    //     return ret
    // }
    // else if (mimeType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    //     return read(await (await response.blob()).arrayBuffer(), { dense: true })
}
