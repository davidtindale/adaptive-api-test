export function alarmName(name: string){
    let index = name.lastIndexOf('.')
    return index !== -1 && index >= 6 && name.substring(index - 6, index) === 'Alarms'
     ? name.substring(index + 1) : ''
}

export function isAlarm(name: string) {
    return alarmName(name).length !== 0
}