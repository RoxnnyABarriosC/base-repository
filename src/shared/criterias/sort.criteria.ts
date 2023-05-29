import { Sort } from '@shared/abstractClass';

export class SortCriteria<E = any>
{
    private readonly sorts: Map<string, string>;

    constructor(sort: Sort)
    {
        this.sorts = new Map<string, string>();
        const sorts: any = sort?.Sort ?? [];
        const keys: any = sort?.Fields ?? {};

        const newSorts = Object.keys(sorts).map((key: string) =>
        {
            const _sort: any = sort.Sort;
            let value = {};

            if (_sort[key])
            {
                value = {
                    [key]: _sort[key]
                };
            }

            return value;
        }).filter((value =>
        {
            const key = Object.keys(value)[0];
            return keys.includes(key) ? value : false;
        }));

        newSorts.forEach((newSort: any) =>
        {
            const defaultKey: string = Object.keys(newSort)[0];
            const defaultValue: string = newSort[defaultKey];

            if (defaultValue)
            {
                this.sorts.set(defaultKey, defaultValue);
            }
        });

        const defaultSorts = sort.DefaultSorts;

        if (this.sorts.size === 0)
        {
            defaultSorts.forEach((defaultSort: any) =>
            {
                const defaultKey: string = Object.keys(defaultSort)[0];
                const defaultValue: string = defaultSort[defaultKey];

                this.sorts.set(defaultKey, defaultValue);
            });
        }
    }

    public get(): Map<string, string>
    {
        return this.sorts;
    }
}
