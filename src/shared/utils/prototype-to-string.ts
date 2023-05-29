
export enum StringPrototypes {
    STRING = '[object String]',
    NUMBER = '[object Number]',
    Boolean = '[object Boolean]',
    NULL = '[object Null]',
    UNDEFINED = '[object Undefined]',
    OBJECT = '[object Object]',
    ARRAY = '[object Array]',
    FUNCTION = '[object Function]',
    DATE = '[object Date]',
}

export function PrototypeToString(value: any, stringPrototype?: StringPrototypes | string): StringPrototypes | string | boolean
{
    const prototypeString = Object.prototype.toString.call(value);

    if (stringPrototype)
    {
        return prototypeString === stringPrototype;
    }

    return prototypeString;
}
