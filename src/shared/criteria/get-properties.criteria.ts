import { RmProp } from '@shared/utils';

export class GetPropertiesCriteria<D extends object>
{
    private readonly properties: (keyof D)[];

    constructor(private readonly data: D, rmProps: (keyof D)[] = [])
    {
        data = { ...data };
        RmProp(data, rmProps as any);
        this.properties = Object.getOwnPropertyNames(data) as (keyof D)[];
    }

    get Fields(): (keyof D)[]
    {
        return this.properties;
    }

    get Properties(): object
    {
        return this.properties.reduce((acc, field) =>
        {
            return {
                ...acc,
                [field]: this.data[field]
            };
        }, {});
    }
}
