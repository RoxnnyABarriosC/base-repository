export const SlugGenerator = (value: string) => value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
