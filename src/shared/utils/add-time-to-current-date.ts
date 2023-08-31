import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

/**
 * Adds time to the current date.
 * @param {string} time - The time to add in the format 'number[unit]', where unit can be 'd' for day, 'h' for hour, 'm' for minute, 's' for second, or 'ms' for millisecond.
 * @param {number} [moreTime=0] - Additional time to add in milliseconds.
 * @returns {Dayjs} The resulting date after adding the specified time.
 */
export const addTimeToCurrentDate = (time: string, moreTime = 0): Dayjs =>
{
    dayjs.extend(utc);

    const conversions = {
        d: 'day',
        h: 'hour',
        m: 'minute',
        s: 'second',
        ms: 'millisecond'
    };

    const matches = time.match(/^(\d+)([dhms]?[s]?[m]?[h]?[d]?|ms)?$/);

    if (!matches)
    {
        throw new Error('Invalid time format');
    }

    const quantity = parseInt(matches[1], 10);
    const unit = matches[2] || 'ms';
    const convertedUnit = conversions[unit];

    if (!convertedUnit)
    {
        throw new Error('Invalid unit');
    }

    return dayjs().utc().add(quantity + moreTime, convertedUnit);
};
