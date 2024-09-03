import { Command } from "../data/Command"
import { StepRaw } from "../data/Step"

export interface ProgramGroup {
    group: string
    programs: Program[]
    commands: Command[]
    programSections?: ProgramSection[]
}


export interface Program {
    number: string
    name?: string
    steps: StepRaw[]
    notes?: string
    code?: string
    modifiedTime?: Date
    modifiedBy?: string
    // duration?: number
}

export interface ProgramSection {
    number: number
    name: string
}