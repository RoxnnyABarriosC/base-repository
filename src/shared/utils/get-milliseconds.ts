/**
 * This function converts a time string into a number of milliseconds.
 * @param {string} time - The time string to be converted. The string must be in the format of a number followed by an optional unit (d, h, m, s, ms).
 * @returns {number} The number of milliseconds represented by the given time string.
 * @throws {Error} If the time string is not in a valid format or if the unit is not recognized.
 */
export const GetMilliseconds = (time: string): number =>
{
    const conversions = {
        d: 8.64e+7,
        h: 3.6e+6,
        m: 60000,
        s: 1000,
        ms: 1
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

    return Math.floor(quantity * convertedUnit);
};
