import { MapCriteria } from '@shared/criteria';
import { Parse, PrototypeToString, StringPrototypes } from '@shared/utils';
import pgp from 'pg-promise';
import { Brackets, SelectQueryBuilder } from 'typeorm';

export declare type AttributeConfig<F = any, E = any> = {
    attribute: KeyAttribute<F>;
    dbAttribute?: KeyAttribute<E>;
    isBoolean?: boolean;
    toLower?: boolean;
};

export declare type KeyAttribute<F = any> = (keyof F);

export declare type SearchConfig<E = any> = {
    attributesDB: KeyAttribute<E> | KeyAttribute<E>[] | AttributeDBConfig<E>[];
    rank?: boolean;
}

export declare type AttributeDBConfig<E = any> = {
    name: string |  KeyAttribute<E>;
    tableAlias?: string;
}


export declare type FilterCondition = 'andWhere' | 'orWhere' | 'where';

export declare type FilterOperator = '=' | 'ilike' | '>' | '>=' | '<=' | 'in';
export declare type FilterOperatorIs = 'IS NOT NULL' | 'IS NULL';

export declare type MultiFilterOperator = '=' | 'ilike';

export class PgSqlFilterCriteriaV2<F = any, E = any>
{
    private readonly _filter: MapCriteria;
    private readonly queryBuilder: SelectQueryBuilder<E>;

    constructor(filter: MapCriteria<F>, queryBuilder: SelectQueryBuilder<E>)
    {
        this._filter = filter;
        this.queryBuilder = queryBuilder;
    }

    /**
     * @param attribute
     * @param condition
     * @param operator
     * @param alias
     */
    filter(attribute: AttributeConfig<F, E> | KeyAttribute<F>, condition: FilterCondition, operator: FilterOperator, alias = 'i'): void
    {
        let _attribute: string = attribute as string;
        let _dbAttribute: string = attribute as string;
        let _isBoolean = false;
        let _toLower = false;

        if (PrototypeToString(attribute, StringPrototypes.OBJECT))
        {
            _attribute = (attribute as AttributeConfig).attribute as string;
            _dbAttribute = <string> (attribute as AttributeConfig)?.dbAttribute ?? _attribute;
            _isBoolean = (attribute as AttributeConfig)?.isBoolean ?? _isBoolean;
            _toLower = (attribute as AttributeConfig)?.toLower ?? _toLower;
        }

        if (this._filter.has(_attribute))
        {
            let valueAttribute: string | string[] | boolean = this._filter.getOne(_attribute);
            let aliasAttribute = `:${_attribute}`;

            if (_isBoolean)
            {
                valueAttribute = Parse<boolean>(valueAttribute);
            }

            if (operator === 'in')
            {
                aliasAttribute = `(:...${_attribute})`;
                valueAttribute = this.getValuesOfAFilter(_attribute);
            }

            if (operator === 'ilike')
            {
                aliasAttribute = `:${_attribute}`;
                valueAttribute = `%${valueAttribute}%`;
            }

            if (_toLower)
            {
                this.queryBuilder[condition](`LOWER(${alias}.${_dbAttribute}) ${operator} LOWER(${aliasAttribute})`);
            }

            else
            {
                this.queryBuilder[condition](`${alias}.${_dbAttribute} ${operator} ${aliasAttribute}`);
            }

            void this.queryBuilder.setParameter(_attribute, valueAttribute);
        }
    }

    /**
     * @param attribute
     * @param condition
     * @param alias
     */
    filterInArrayString(attribute: Omit<AttributeConfig<F, E>, 'toLower' | 'isBoolean'>  | KeyAttribute<F>, condition: FilterCondition, alias = 'i'): void
    {
        let _attribute: string = attribute as string;
        let _dbAttribute: string = attribute as string;

        if (PrototypeToString(attribute, StringPrototypes.OBJECT))
        {
            _attribute = (attribute as AttributeConfig).attribute as string;
            _dbAttribute = <string> (attribute as AttributeConfig)?.dbAttribute ?? _attribute;
        }

        if (this._filter.has(_attribute))
        {
            const value = this._filter.getOne<string | string[]>(_attribute);
            let valueAttribute: string[] | string = value;

            if (!PrototypeToString(value, StringPrototypes.STRING) && !PrototypeToString(value, StringPrototypes.ARRAY))
            {
                throw new Error('The value of the property sent as a filter must be strings separated by commas "," or array');
            }
            else if (PrototypeToString(value, StringPrototypes.STRING))
            {
                valueAttribute = this._filter.getOne(_attribute).split(',');
            }

            valueAttribute = `'${  (valueAttribute as string[]).join('\',\'')  }'`;

            this.queryBuilder[condition](`EXISTS ( SELECT * FROM unnest(string_to_array("${alias}"."${_dbAttribute}"::varchar, ',') ) as datarray WHERE datarray = ANY(ARRAY[${valueAttribute}]))`);
        }
    }

    /**
     * @param attribute
     */
    getValuesOfAFilter(attribute: KeyAttribute<F> | string): string[]
    {
        const filters: string[] = [];

        if (this._filter.has(attribute))
        {
            const value = this._filter.getOne(attribute);

            if (Array.isArray(value))
            {
                filters.push(...value);
            }
            else
            {
                this._filter.getOne<string>(attribute)?.trim().split(',').map((_attr: string) =>
                {
                    if (_attr?.trim().length > 0)
                    {
                        filters.push(_attr.trim());
                    }
                });
            }
        }

        return [...new Set(filters)];
    }

    /**
     * @param attribute
     * @param searchConfig
     * @param condition
     * @param alias
     */
    search(attribute: KeyAttribute<F> | string, searchConfig: SearchConfig<E>, condition: FilterCondition, alias = 'i'): void
    {
        const attrsDB = searchConfig.attributesDB;
        const rank = searchConfig.rank ?? false;

        if (this._filter.has(attribute))
        {
            const valueAttr: string = this._filter.getOne<string>(attribute)?.trim();

            const valueSearchAttr: string = valueAttr.trim()
                .replace(/\s+/g, ' ')
                .split(' ')
                .map((_attr: string) => `%${_attr}%`).join(' ');

            let searchAtt: string | string[];


            if (PrototypeToString(attrsDB, StringPrototypes.STRING))
            {
                searchAtt = `coalesce("${alias}"."${attrsDB as string}"::text,'')`;
            }

            if (PrototypeToString(attrsDB, StringPrototypes.ARRAY))
            {
                if (PrototypeToString(attrsDB[0], StringPrototypes.STRING))
                {
                    searchAtt = (<string[]>attrsDB).map((attrDB: string) => `coalesce("${alias}"."${attrDB}"::text,'')`).join(' || \' \' || ');
                }

                if (PrototypeToString(attrsDB[0], StringPrototypes.OBJECT))
                {
                    searchAtt = (<AttributeDBConfig[]>attrsDB).map((attrDB: AttributeDBConfig) =>
                    {
                        const tableAlias: string = attrDB?.tableAlias ?? alias;

                        const _attr = `"${tableAlias}"."${(<string>attrDB.name)}"`;

                        return `coalesce(${_attr}::text,'')`;
                    }).join(' || \' \' || ');
                }
            }

            if (valueAttr.length > 0)
            {
                this.queryBuilder.addSelect(`(similarity(${searchAtt}, :search))`, 'rank');
                this.queryBuilder[condition](`((${searchAtt}) ILIKE ANY(string_to_array(:parseSearch,' ')))`);
                this.queryBuilder.setParameters({
                    search: valueAttr,
                    parseSearch: valueSearchAttr
                });

                if (rank)
                {
                    this.queryBuilder.orderBy('rank', 'DESC');
                }
            }
        }
    }

    /**
     * @param fn
     */
    async customFilter(fn: (fltr: MapCriteria<F>, qb: SelectQueryBuilder<E>) => Promise<void>): Promise<void>
    {
        void await fn(this._filter, this.queryBuilder);
    }

    /**
     * @param attribute
     * @param condition
     * @param operator
     * @param alias
     */
    is(attribute: Omit<AttributeConfig<F, E>, 'toLower'> | KeyAttribute<F>, condition: FilterCondition, operator: FilterOperatorIs, alias = 'i'): void
    {
        let _attribute: string = attribute as string;
        let _dbAttribute: string = attribute as string;
        let _isBoolean = false;

        if (PrototypeToString(attribute, StringPrototypes.OBJECT))
        {
            _attribute = (attribute as AttributeConfig).attribute as string;
            _dbAttribute = <string> (attribute as AttributeConfig)?.dbAttribute ?? _attribute;
            _isBoolean = (attribute as AttributeConfig)?.isBoolean ?? _isBoolean;
        }

        if (this._filter.has(_attribute))
        {
            let valueAttr: string | string[] | boolean = this._filter.getOne(_attribute);

            if (_isBoolean)
            {
                valueAttr = Parse(valueAttr);
            }

            if (valueAttr)
            {
                this.queryBuilder[condition](`${alias}.${_dbAttribute} ${operator}`);
            }
        }
    }

    /**
     * @param attribute
     * @param condition
     * @param operator
     * @param alias
     */
    multiFilter(attribute: Omit<AttributeConfig<F, E>, 'isBoolean'> | KeyAttribute<F>, condition: FilterCondition, operator: MultiFilterOperator, alias = 'i'): void
    {
        let _attribute: string = attribute as string;
        let _dbAttribute: string = attribute as string;
        let _toLower = false;

        if (PrototypeToString(attribute, StringPrototypes.OBJECT))
        {
            _attribute = (attribute as AttributeConfig).attribute as string;
            _dbAttribute = <string> (attribute as AttributeConfig)?.dbAttribute ?? _attribute;
            _toLower = (attribute as AttributeConfig)?.toLower ?? _toLower;
        }

        if (this._filter.has(_attribute))
        {
            this.queryBuilder[condition](new Brackets(qb =>
            {
                const values: string[] = this.getValuesOfAFilter(_attribute);

                values.forEach((_attr: string, index: number) =>
                {
                    const where: 'where' | 'orWhere' = index === 0 ? 'where' : 'orWhere';

                    const aliasAttr = `${_attribute}_${index}`;
                    let valueAttr: string = _attr?.trim();

                    if (operator === 'ilike')
                    {
                        valueAttr = `%${valueAttr}%`;
                    }

                    if (valueAttr.length > 0)
                    {
                        if (_toLower)
                        {
                            qb[where](`LOWER(${alias}.${_dbAttribute}) ${operator} LOWER(:${aliasAttr})`, { [aliasAttr]: valueAttr });
                        }

                        else
                        {
                            qb[where](`${alias}.${_dbAttribute} ${operator} :${aliasAttr}`, { [aliasAttr]: valueAttr });
                        }
                    }
                });
            }));
        }
    }

    /**
     * @param attribute
     * @param compareTo
     * @param condition
     * @param alias
     */
    booleanMultiFilter(attribute: KeyAttribute<F> | string, compareTo = true, condition: FilterCondition = 'andWhere', alias = 'i'): void
    {
        if (this._filter.has(attribute))
        {
            this.queryBuilder[condition](new Brackets(qb =>
            {
                const values: string[] = this.getValuesOfAFilter(attribute);

                values.forEach((_attr: string, index: number) =>
                {
                    const where = index === 0 ? 'where' : 'orWhere';

                    const aliasAttr = `${attribute as string}_${index}`;

                    qb[where](`${alias}.${_attr?.trim()} = :${aliasAttr} `, { [aliasAttr]: compareTo });
                });
            }));
        }
    }

    partialRemoved(filter: string): void
    {
        void (this.customFilter(async(fltr, qb) =>
        {
            if (fltr.has(filter))
            {
                const withDeleted = fltr.getOne<boolean>(filter as any);

                if (withDeleted)
                {
                    qb.withDeleted();
                }
            }
        }));
    }
}

