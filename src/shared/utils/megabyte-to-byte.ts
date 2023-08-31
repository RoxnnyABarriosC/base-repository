/**
 * This function converts a number of megabytes into a number of bytes.
 * @param {number} megabytes - The number of megabytes to be converted.
 * @returns {number} The number of bytes represented by the given number of megabytes.
 */
export const  megabytesToBytes = (megabytes: number): number =>
{
    const byte = 1000000;
    return megabytes * byte;
};
