import { PrototypeToString, StringPrototypes } from './prototype-to-string';

export const StringToArray = (value: string | string[], separator: string) =>
{
    let data = value;

    if (!PrototypeToString(data, StringPrototypes.STRING) && !PrototypeToString(data, StringPrototypes.ARRAY))
    {
        return value;
    }

    if (PrototypeToString(data, StringPrototypes.STRING))
    {
        data = (data as string).split(separator);
    }

    return [...new Set(data)];
};
