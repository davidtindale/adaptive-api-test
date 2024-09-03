import { PrefixedStep, Step, ValueProfile } from "../data/Step"

export enum Running {
    NotRunning,
    RunningButPaused,
    RunningNow
}

export enum HistoryTagsFilter {
    All = 0,
    Traces = 1,
}

export interface HistoryOptions {
    tagsFilter?: HistoryTagsFilter
    start?: number | Date 
    end?: number | Date
    valuesOnlyId?: string 
}

export interface TimelineItem {
    start: number
    end: number
    resource: string
    id: unknown
}

export interface TimeSlotMessageCountResult {
    start: Date
    end: Date
    count: number
}

// Everything about a single program
export interface ExpandedProgramSteps {
    steps: PrefixedStep[]  // all steps expanded out from any IP's
    programs: Program[]  // programs referenced
}


export interface LiveMachine {
    machine: string
    type?: string
}

export interface LiveMachines {
    // host: string
    machines: LiveMachine[]
}

// export interface TypeData {
//     className: string
//     tags: Tag[]
//     commands: Command[]
//     screenButtons: ScreenButton[]
// }

export interface ScreenButton {
    text: string
    svg?: {
        viewBox: string
        d: string
    }
}

export interface SampleStep extends Step {
    index: number
}
export interface RunningProfile extends ValueProfile {
    currentStep: number
    changingStep: number
    sampleSteps: SampleStep[]
}

export interface ProgramGroup {
    group: string
    programs: Program[]
}

export interface ProgramNumberAndName {
    number: string
    name: string
}

export interface Program {
    number: string
    name?: string
    steps: Step[] | number
    notes?: string
    code?: string
    modifiedTime?: Date
    modifiedBy?: string
}

interface MessageNumberAndText {
    number: number
    text: string
}

export interface TimeSlotCount {
    count: number[]
}

export interface TimelineTime {
    time: Date
    id: unknown
}

// export type ResourceGroups = GroupAndItems<string, string>[]


export interface ShiftPattern {
    fromDate?: number
    repeatPeriodInDays?: number
    fromTime: number
    shifts: Shift[]
}

export interface Shift {
    name: string
    duration: number
}

export interface SubstituteStep {
    command: string
    parameters?: (string | number)[]
}


export interface GroupNumberAndName {
    group?: string
    number: string
    name: string
}

export type ProgramNumber = string | NumberNameAndSteps


export interface NumberNameAndSteps extends GroupNumberAndName {
    steps: string[]
}


// export interface InTrayJob extends Job2 { }

export interface Stoppage extends TimelineItem {
    id: number
    text: string
    notes?: string
}


export interface Job {
    id: unknown

    running?: {
        currentStep: number
        changingStep?: number
    }

    blocked?: boolean
    committed?: boolean
    // earliestStart?: Date
    // expectedDuration?: number

    color?: string
    notes?: string
    programs?: (string | GroupNumberAndName)[]
    parameters?: {command: string}[]
    profile?: ValueProfile
}

export interface ScheduledJob extends Job {
    start: number
    end: number
}
