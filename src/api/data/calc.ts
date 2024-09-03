export default function calc(s1: string | undefined): Calc | undefined {
    if (!s1) return undefined
    const s = s1;
    let index = 0;
    return getCalc();

    function sIsDigit() { return isDigit(s[index]); }
    function sIsLetter() { return isLetter(s[index]); }

    function getCalc(): Calc {
        // Get to the next left-hand operator
        while (index < s.length && s[index].trim() === '') index++;
        if (index === s.length) return () => 0; // that's all folks


        // Constant
        let lhs: Calc; // left-hand value
        if (sIsDigit() || (s[index] === "-" && isDigit(s[index + 1]))) {
            let neg = false;
            let x = 0;
            if (s[index] === "-") { neg = true; index++; }
            while (index < s.length && (s[index] === ":" || sIsDigit())) {
                if (s[index] === ":") {
                    index++;
                    if (!sIsDigit()) break;
                    x = x * 6 + (s[index].charCodeAt(0) - 48);
                }
                else
                    x = x * 10 + (s[index].charCodeAt(0) - 48);
                index++;
            }
            if (neg) x = -x;
            lhs = () => x;

            // Reference to a parameter    
        } else if (s[index] === "'") {
            index++;
            if (index === s.length) return () => 0;
            if (sIsDigit()) {
                const parameterNumber = getInt() - 1; // parameter number
                lhs = (parameters) => {
                    const s = parameters?.[parameterNumber];
                    try {
                        if (typeof s === 'number')
                            return s;
                        if (s) return parseFloat(s);
                    } catch { }
                    return 0;
                };
            }
            else
                lhs = getNamedParameter();

            // Round brackets    
        } else if (s[index] === "(") {
            index++;
            lhs = getCalc();
            // Search for a matching close bracket
            while (index < s.length && s[index].trim() === '') index++;
            if (index < s.length && s[index] === ")") index++; // no error if not found


            // Negate    
        } else if (s[index] === "-") {
            index++;
            const x2 = getCalc();
            lhs = (parameters, namedParameters) => -x2(parameters, namedParameters);
        } else if (s[index] === "+") { // plus by itself is a no-op
            index++;
            lhs = getCalc();
        } else if (sIsLetter()) {
            lhs = getNamedParameter();
        } else {
            return () => 0; // syntax error really, but just ignore that and the rest of the line
        }

        // Now we have the first value in lhs, we can optionally take a binary operator
        while (index < s.length && s[index].trim() === '') index++;
        if (index === s.length) return lhs; // that's all folks

        if (s[index] === "+") {
            index++;
            const rhs = getCalc();
            return (parameters, namedParameters) => lhs(parameters, namedParameters) + rhs(parameters, namedParameters);
        } else if (s[index] === "-") {
            index++;
            const rhs = getCalc();
            return (parameters, namedParameters) => lhs(parameters, namedParameters) - rhs(parameters, namedParameters);
        } else if (s[index] === "*") {
            index++;
            const rhs = getCalc();
            return (parameters, namedParameters) => lhs(parameters, namedParameters) * rhs(parameters, namedParameters);
        } else if (s[index] === "/") {
            index++;
            const rhs = getCalc();
            return (parameters, namedParameters) => {
                const dividend = lhs(parameters, namedParameters), divisor = rhs(parameters, namedParameters);
                return (divisor === 0) ? 0 : (dividend + Math.floor(divisor / 2)) / divisor; // no divide by 0 please !
            };
        }
        return lhs;
    }

    function getInt() {
        let x = 0;
        while (index < s.length && sIsDigit()) { // Char.IsDigit(s(index))
            x = x * 10 + (s[index].charCodeAt(0) - 48);
            index++;
        }
        return x;
    }


    // Can be used with or without a leading single-quote
    function getNamedParameter(): Calc {
        //  A reference to some named parameter
        const i0 = index;
        while (index < s.length && sIsLetter()) index++;
        const parameterName = s.substring(i0, index);
        let defaultValue = 0;
        // There might also be an equals sign followed by a default value
        if (index < s.length) {
            if (s[index] === "=") {
                index++;
                while (index < s.length && sIsDigit()) {
                    defaultValue = defaultValue * 10 + (s[index].charCodeAt(0) - 48);
                    index++;
                }
            }
        }
        return (_parameters, namedParameters) => {
            const s = namedParameters?.(parameterName);
            try {
                if (s) return parseFloat(s);
            } catch { }
            return defaultValue;
        };
    }
}



export type Calc = (
    parameters: (string | number)[] | undefined,
    namedParameters: ((name: string) => string) | undefined
) => number

function isDigit(c: string) {
    return c >= '0' && c <= '9'
}
function isLetter(c: string) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')
}


