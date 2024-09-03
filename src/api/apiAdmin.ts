import { FeaturesAndUsers, User } from "./apiAdminData"
import { fetchT as fetchT0, url8 } from "./apiToken"

function url0(server: string, path: string) {
    return url8(server, 'admin', path)
}

function fetchT<T>(server: string, token: string, path: string, query?: any, setAbort?: (abort: () => void) => void) {
    return fetchT0<T>(url0(server, path), token, { ...query }, setAbort)
}

export function fetchUsers(server: string, token: string) {
    return fetchT<User[]>(server, token, 'users')
}

export function fetchFeaturesAndUsers(server: string, token: string) {
    return fetchT<FeaturesAndUsers>(server, token, 'featuresAndUsers')
}

export function resetPassword(server: string, token: string, email: string) {
    return fetchT(server, token, 'resetPassword', { email })
}

export function activateUser(server: string, token: string, email: string) {
    return fetchT(server, token, 'activateUser', { email })
}

export function deActivateUser(server: string, token: string, email: string) {
    return fetchT(server, token, 'deActivateUser', { email })
}

export function deleteUser(server: string, token: string, email: string) {
    return fetchT(server, token, 'deleteUser', { email })
}

export function inviteUser(server: string, token: string, email: string) {
    return fetchT(server, token, 'inviteUser', { email })
}

export function addTeam(server: string, token: string, team: string) {
    return fetchT(server, token, 'addTeam', { team })
}

export function deleteTeam(server: string, token: string, team: string) {
    return fetchT(server, token, 'deleteTeam', { team })
}

export function addUserToTeam(server: string, token: string, email: string, team: string) {
    return fetchT(server, token, 'addUserToTeam', { email, team })
}

export function removeUserFromTeam(server: string, token: string, email: string, team: string) {
    return fetchT(server, token, 'removeUserFromTeam', { email, team})
}


export function setUserFeatures(server: string, token: string, email: string, features: string) {
    return fetchT(server, token, 'setUserFeatures', { email, features })
    // method: 'PUT'
}
