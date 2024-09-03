
export enum SignUpResult { Ok, EmailAlreadyExists }

export async function signUp(server: string, email: string, name: string | undefined, password: string | undefined): Promise<SignUpResult> {
    const response = await fetch(`${server}/api/signUp` + query({ email, name, password }), { method: 'PUT' })
    // return response.status === 200 ? response.text() : Promise.reject(response.status)
    return response.status === 200 ? SignUpResult.Ok : SignUpResult.EmailAlreadyExists
}

export async function signIn(server: string, email: string, password: string) {
    const response = await fetch(`${server}/api/signIn` + query({ email, password }))
    if (response.status === 200)  // OK
        return {
            server, email,
            ...await response.json() as { name: string, token: string, admin?: boolean }
        } as Token
    if (response.status === 204)  // No Content
        return 'Account not activated'
    if (response.status === 401) // Unauthorized
        return 'Invalid email or password'
    return Promise.reject(response.status)
}

// Makes the server send an email to a user allowing them to reset their password
export async function forgottenPassword(server: string, email: string) {
    return (await fetch(`${server}/api/forgottenPassword` + query({ email }), { method: 'PUT' })).text()
}

// As long as 'k' is valid, updates a user's password
export async function updatePassword(server: string, key: string, newPassword: string) {
    return (await fetch(`${server}/api/updatePassword` + query({ key, newPassword }), { method: 'PUT' })).text()
}

export interface Token {
    server: string
    world: string
    email: string
    name?: string
    token: string
    admin?: boolean
}

export interface World {
    name: string
    noUsers?: boolean
    // description?: string
    // demo?: boolean
}

export async function fetchWorlds(server: string) {
    return await ((await fetch(`${server}/api/worlds`)).json()) as World[]
}


export function urlWorldImage(server: string, world: string, wide?: boolean) {
    return `${server}/api/worldImage` + query({ world, wide })
}

export function query(options: any | undefined) {
    // // Don't want any undefined's or false's
    // const options2: any = {}
    // if (options) {
    //     const keys = Object.keys(options)
    //         keys.forEach(key => {
    //             const v = options[key]
    //             if (Array.isArray(v))
    //                 v.forEach(w => parts.push(asString(key, w)))
    //             else if (v !== undefined && v !== false)
    //                 parts.push(asString(key, v))
    //         })
    // }

    // const ret = new URLSearchParams(options).toString()
    // return ret ? '?' + ret : ''
    //     console.log(new URLSearchParams({"Plc 1異常": 12} as any).toString())
    // //    console.log(new URLSearchParams(options).toString())
    const parts: string[] = []
    if (options) {
        const keys = Object.keys(options)
        if (keys.length !== 0) {
            keys.forEach(key => {
                const v = options[key]
                if (Array.isArray(v))
                    v.forEach(w => parts.push(asString(key, w)))  // for example, {a: [1,2,3]} becomes a=1&a=2&a=3
                else
                    if (v !== undefined && v !== false)
                        parts.push(asString(key, v))
            })
        }
    }
    return parts.length !== 0 ? '?' + parts.join('&') : ''
}

function iso(v: Date) {
    // Never milliseconds
    let ret = v.toISOString().substring(0, 19) + 'Z'
    if (ret.endsWith('T00:00:00Z'))
        ret = ret.substring(0, 10) // just the date
    return ret
}

function asString(key: any, v: any) {
    return key + '=' + encodeURIComponent((v instanceof Date ? iso(v) : v != undefined ? v.toString() : ''))
}
