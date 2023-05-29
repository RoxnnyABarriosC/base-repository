import { Expose } from 'class-transformer';

export type DefaultFilters<E> = {
    [Key in keyof E]?: any;
}[]

export abstract class Filter
{
    @Expose()
    Fields(): string[]
    {
        return Object.getOwnPropertyNames(this);
    }

    @Expose()
    Filter()
    {
        return this.Fields().reduce((acc, field) =>
        {
            return {
                ...acc,
                [field]: this[field]
            };
        }, {});
    }

    abstract get DefaultFilters(): Record<string, any>
}
