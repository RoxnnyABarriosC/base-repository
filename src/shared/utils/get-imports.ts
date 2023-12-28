export const getImports = (...imports: object[]): any[] =>
{
    const _imports = imports.reduce((acc, current) => ({ ...acc, ...current }), {});
    return Object.values(_imports);
};
