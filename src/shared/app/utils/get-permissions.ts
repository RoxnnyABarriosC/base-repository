export const getPermissions = (...enums: any[]) =>
{
    return  enums.reduce((acc: any[], _enum: any) => [...new Set([...acc, ... Object.values(_enum)])], []);
};
