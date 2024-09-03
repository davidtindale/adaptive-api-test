import { AdaptiveHistory } from './AdaptiveHistory'
import { actuationsLineData, actuationsLineData2 } from './AdaptiveHistory.utils'
import toSpaced from '../../utils/toSpaced'
import { isAlarm, alarmName } from './isAlarm'
import { useAppState } from '../../app/AppContext'

export default function exceptionsData(history: AdaptiveHistory) {
    const ret = history.tags
        .filter(tag => isAlarm(tag.name))
        .map(tag => ({
            name: toSpaced(alarmName(tag.name)),
            value: actuationsLineData(tag, history.elapsedTimes)
        }))
        .filter(x => x.value.length)
        .flatMap(x => x.value.map(y => ({ name: x.name, ...y })))
        .map(x => ({ type: 'alarm', ...x }))

    const phDelay = history.tags.find(tag => tag.name === 'Delay')
    if (phDelay) {
        const { t } = useAppState()
        ret.push(...actuationsLineData2(phDelay, history.elapsedTimes)
            .filter(x => x.value)
            .map(x => ({
                type: 'delay',
                name: t('delay') + ' ' + x.value,
                start: x.start,
                end: x.end
            })))
    }
    ret.sort((a, b) => a.start - b.start)
    return ret
}



