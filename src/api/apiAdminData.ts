import { Feature } from "./apiToken"

export interface FeaturesAndUsers {
    allFeatures: Feature[]
    users: User[]
}
export interface User {
    tag: string
    name?: string
    needsActivation?: boolean
    noPassword?: boolean
    features?: Feature[]
    teams?: string[]
}
