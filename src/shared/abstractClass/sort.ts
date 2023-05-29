import { Expose } from 'class-transformer';

export type DefaultSorts<E> = {
    [Key in keyof E | string ]?: 'desc' | 'asc';
}[]

export abstract class Sort
{
    @Expose()
    Fields(): string[]
    {
        return Object.getOwnPropertyNames(this);
    }

    @Expose()
    Sort()
    {
        return this.Fields().reduce((acc, field) =>
        {
            return {
                ...acc,
                [field]: this[field]
            };
        }, {});
    }

    abstract get DefaultSorts(): Record<string, any>
}
