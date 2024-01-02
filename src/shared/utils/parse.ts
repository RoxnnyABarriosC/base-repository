import { Logger } from '@nestjs/common';
import { LoggerContext } from '@shared/enums/logger-context';

/**
 * Function to parse an input value and convert it to a specific type.
 * @param {any} value - The value to be parsed.
 * @returns {T} The parsed value converted to the type specified by T.
 * @template T
 * @type {number | string | boolean | [] | object | Date}
 */
export const Parse = <T extends number | string | boolean | [] | object | Date>(value: any): T =>
{
    Logger.log('Parsing...', LoggerContext.PARSE);
    Logger.log(`Original value: ${ typeof  value}`, LoggerContext.PARSE);

    try
    {
        value = JSON.parse(value);
    }
    catch (e)
    {
        Logger.log('Changing parsing strategy...', LoggerContext.PARSE);
    }

    if (typeof value === 'string')
    {
        if (!isNaN(+value))
        {
            return +value as T;
        }

        const date = Date.parse(value);
        if (!isNaN(date))
        {
            return new Date(date) as T;
        }
    }

    Logger.log(`New value: ${ typeof  value}`, LoggerContext.PARSE);

    return value;
};
