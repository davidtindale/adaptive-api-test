export interface StepRaw {
    command?: string
    parameters?: string[] | number[]
    notes?: string
}

export interface Step extends StepRaw {
    name?: string  // long name or message text
    text?: string  // formatted form
    isParallel?: boolean
}

export interface Theoretical {
    elapsed: number  // in milliseconds
    extraTime: number
    totalTime: number  // handy - is the sum of elapsed and extraTime
    valueAfter: number
}

export interface Prefix {
    program: string
    step: number
    position: number[]
}

export interface PrefixedStep extends Step, Prefix, Theoretical {
}

export interface ValueProfile {
    elapsed: number[]
    extraTime?: number[]
    valueAfter: number[]
}

export interface ParentProgram {
    number: string
    name: string
    steps: Step[]
}

export interface RunningSteps {
    currentStep: number
    paused: boolean
    changingStep: number
    steps: PrefixedStep[]
    timeInSteps: (number|null)[]
    programs: ParentProgram[]
}

