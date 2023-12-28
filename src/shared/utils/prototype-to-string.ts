
export enum StringPrototypes {
    STRING = '[object String]',
    NUMBER = '[object Number]',
    BOOLEAN = '[object Boolean]',
    NULL = '[object Null]',
    UNDEFINED = '[object Undefined]',
    OBJECT = '[object Object]',
    ARRAY = '[object Array]',
    FUNCTION = '[object Function]',
    DATE = '[object Date]',
}

/**
 * This function returns the string representation of the prototype of a given value, or checks if the prototype of the value matches a given string representation.
 * @param {any} value - The value whose prototype should be checked.
 * @param {StringPrototypes | string} [stringPrototype] - An optional string representation of a prototype to check against.
 * @returns {StringPrototypes | string | boolean} If a stringPrototype is provided, the function returns true if the prototype of the value matches
 * the given string representation, and false otherwise. If no stringPrototype is provided, the function returns the string representation of the prototype of the value.
 */
export function PrototypeToString(value: any, stringPrototype?: StringPrototypes | string): StringPrototypes | string | boolean
{
    const prototypeString = Object.prototype.toString.call(value);

    if (stringPrototype)
    {
        return prototypeString === stringPrototype;
    }

    return prototypeString;
}
