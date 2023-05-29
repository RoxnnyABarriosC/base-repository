import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

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
