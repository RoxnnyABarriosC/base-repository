import { DEFAULT_PROPERTIES } from '@shared/criteria/constants';
import { Filter, Sort } from './abstractClass';
import { GetPropertiesCriteria } from './get-properties.criteria';

export class MapCriteria<E = any>
{
    private readonly criterias: Map<string, any>;

    constructor(data: Filter | Sort)
    {
        this.criterias = new Map<string, any>();
        const criteria = new GetPropertiesCriteria(data, [DEFAULT_PROPERTIES] as any);

        const properties: object = criteria?.Properties ?? {};
        const keys: string[] = criteria?.Fields ?? [];
        const defaultProperties = data[DEFAULT_PROPERTIES] ?? [];
        defaultProperties.forEach((defaultFilter: any) =>
        {
            const defaultKey: string = Object.keys(defaultFilter)[0];
            const defaultValue: string = defaultFilter[defaultKey];

            if (defaultValue !== undefined && defaultValue !== null)
            {
                this.criterias.set(defaultKey, defaultValue);
            }
        });
        const newFilters = Object.keys(properties).map((key: string) =>
        {
            const _filter: Record<string, any> = criteria.Properties as Record<string, any>;
            let value = {};

            if (_filter[key] !== undefined && _filter[key] !== null)
            {
                value = {
                    [key]: _filter[key]
                };
            }

            return value;
        }).filter((value =>
        {
            const key = Object.keys(value)[0];
            return keys.includes(key) ? value : false;
        }));

        newFilters.forEach((newFilter: any) =>
        {
            const defaultKey: string = Object.keys(newFilter)[0];
            const defaultValue: string = newFilter[defaultKey];

            if (defaultValue !== undefined && defaultValue !== null)
            {
                this.criterias.set(defaultKey, defaultValue);
            }
        });
    }

    public get(): Map<string, string>
    {
        return this.criterias;
    }

    getOne<F>(key: keyof E | F, defaultValue: F = null): F
    {
        return this.criterias.has(<any>key) ? this.criterias.get(<any>key) : defaultValue;
    }

    set<F>(key: keyof E | F, value: any): void
    {
        this.criterias.set(key as any, value);
    }

    getArray(): any
    {
        return this.criterias.entries();
    }

    has<F>(key: keyof E | F): boolean
    {
        return this.criterias.has(<any>key);
    }

    isEmpty(): boolean
    {
        return this.criterias.size === 0;
    }

    values(): Map<string, any>
    {
        return this.criterias;
    }
}
