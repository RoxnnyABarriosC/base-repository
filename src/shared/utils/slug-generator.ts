/**
 * This function generates a slug from a given string.
 * @param {string} value - The string to be converted into a slug.
 * @returns {string} The generated slug.
 */

export const SlugGenerator = (value: string) => value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
