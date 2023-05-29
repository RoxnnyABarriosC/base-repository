export const  createSearchRegex = <T extends string>(param: T | T[]): RegExp =>
{
    const params = Array.isArray(param) ? param : [param];
    return new RegExp(`(${params.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'i');
};
