import { Command, CommandCalc } from "./Command"
import { StepRaw, Theoretical } from "./Step"

export function theoretical(step: StepRaw, command: (Command & CommandCalc) | undefined, initialValue?: number): Theoretical {
    let elapsed = 0
    let extraTime = 0
    let valueAfter = initialValue ?? 30
    let valueChanged = false

    // A QQ takes a fixed amount of time
    if (step.command === 'QQ') {
        elapsed = 10 * 60 * 1000 // StandardValues.QQTime.Ticks
        // } else if (st.isMessage) {  //  str.Length = 2 AndAlso Char.IsDigit(str.Chars(0)) AndAlso Char.IsDigit(str.Chars(1))
        //     elapsed = 10 * 60 // StandardValues.MessageTime.Ticks
    } else {
        if (step.command) {
            // if (command.profiles.length !== 0) {
            //     // Add profile information for these particular step parameter values
            //     const profile = command.profiles[0]
            //     const target = Command.getCalc(profile.target)(st.parameters)
            //     const during = 60 * Command.getCalc(profile.minutes)(st.parameters)
            //     // profileInfo = new ProfileInfo(profile.Name, target, during)
            // }
            // if (command.isParallelCommand) {
            //     // look for a long elapsed time on parallel commands
            //     const parElapsed = 60 * command.calcMinutes(st.parameters)
            //     // if (largestParallelElapsedTime < parElapsed) largestParallelElapsedTime = parElapsed
            // } else {
            // Perhaps back-adjust the times on a previous none-parallel step
            // if (largestParallelElapsedTime !== 0 && previousNoneParallelStep !== null && largestParallelElapsedTime > previousNoneParallelStep.totalTime) {
            //     totalElapsed += largestParallelElapsedTime - previousNoneParallelStep.totalTime
            //     previousNoneParallelStep.setExtraTime(largestParallelElapsedTime - previousNoneParallelStep.elapsed)
            // }
            // largestParallelElapsedTime = 0 : previousNoneParallelStep = stWithTheoreticals
            // Elapsed time is always relevant
            const namedParameters = undefined // (name: string) => ''

            elapsed = command?.calcMinutes ? 60000 * command.calcMinutes(step.parameters, namedParameters) : 0

            const target = command?.calcTarget?.(step.parameters, namedParameters)
            if (target !== undefined && target !== 0) {
                if (command?.calcGradient) {
                    const gradient = command.calcGradient(step.parameters, namedParameters)
                    // Show any consequent changes
                    // Both 0 and 99 mean maximum gradient
                    if (gradient === 0 || gradient === 99) {
                        // if (maximumGradient === 0) maximumGradient = 50
                        // gradient = maximumGradient
                    }
                    if (elapsed !== 0) extraTime = elapsed // this is the extra hold time at the end
                    elapsed = 60000 * ((Math.abs(target - valueAfter) * 10) / gradient)
                }
                valueAfter = target
                valueChanged = true
            }
            // }
            // A message takes a fixed amount of time
        }
    }
    return { 
        elapsed, 
        extraTime, 
        totalTime: elapsed + extraTime, 
        valueAfter 
    }
}
