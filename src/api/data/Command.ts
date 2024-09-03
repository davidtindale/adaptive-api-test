import { Calc } from "./calc"

export interface Command {
    name: string
    longName?: string
    format?: string
    minutes?: string
    gradient?: string
    target?: string
    commandType?: number
    description?: string
    category?: string
}

export interface CommandCalc {
    calcMinutes: Calc | undefined
    calcGradient: Calc | undefined
    calcTarget: Calc | undefined
}
