export interface Tag {
    name: string
    // originalName?: string
    //    displayName: string
    type: string | {}
    category?: string
    description?: string
    minimum?: number
    maximum?: number
    io?: IO
    trace?: Trace
    format?: string
}

export interface IO {
    ioType: 'dinp' | 'dout' | 'aninp' | 'anout' | 'temp' | 'counter'
    channel: number
    allowOverride?: boolean
    device?: string
    format?: string
}

export interface Trace {
    color: string
    sets?: string[]
}
export interface NumberTrace extends Trace {
    minValue: number
    maxValue: number
    minYPercent: number
    maxYPercent: number
    format?: string
    labels?: Label[]
}

export interface BooleanTrace extends Trace {
}

export function isBoolean(trace: Trace): trace is BooleanTrace {
    return (trace as any).minValue === undefined
}

export function isNumber(trace: Trace): trace is NumberTrace {
    return (trace as any).minValue !== undefined
}

export interface Label {
    text: string
    value: number
}

export function tagFormat(tag: Tag) {
    // console.log('tagFormat', tag)
    return tag.format ?? tag.io?.format ?? (tag.trace as NumberTrace | undefined)?.format ?? (isAnalog(tag.io?.ioType) ? '%t' : '')
}

function isAnalog(ioType: string | undefined) {
    return ioType === 'aninp' || ioType === 'anout' || ioType === 'temp'
}
