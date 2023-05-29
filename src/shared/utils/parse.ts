import { Logger } from '@nestjs/common';
import { ErrorContext } from '@shared/constants';

export const Parse = <T extends number | string | boolean | [] | object | Date>(value: any): T =>
{
    Logger.log('Parsing...', ErrorContext.PARSE);
    Logger.log(`Original value: ${ typeof  value}`, ErrorContext.PARSE);

    try
    {
        value = JSON.parse(value);
    }
    catch (e)
    {
        Logger.log('Changing parsing strategy...', ErrorContext.PARSE);
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

    Logger.log(`New value: ${ typeof  value}`, ErrorContext.PARSE);

    return value;
};
