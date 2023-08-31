/**
 * This function creates a regular expression for searching for one or more strings.
 * @param {string | string[]} param - A string or an array of strings to be searched for.
 * @returns {RegExp} A regular expression for searching for the given strings.
 */
export const  createSearchRegex = <T extends string>(param: T | T[]): RegExp =>
{
    const params = Array.isArray(param) ? param : [param];
    return new RegExp(`(${params.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i');
};
