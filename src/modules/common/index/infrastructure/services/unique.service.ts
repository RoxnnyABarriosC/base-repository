import { Inject, Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { BadRequestCustomException } from '@shared/app/exceptions';
import { BaseRepository } from '@shared/typeOrm/abstractClass';
import { I18nContext } from 'nestjs-i18n';
import { FindOperator } from 'typeorm';

interface IUniqueConfig<T = any>
{
    repository: any;
    validate: {
        only?: {[P in keyof T]?: T[P] | FindOperator<T>}
        combined?: {[P in keyof T]?: T[P] | FindOperator<T>}[]
    }
    refValue?: string;
}

@Injectable()
export class UniqueService
{
    private readonly logger = new Logger(UniqueService.name);

    constructor(
        private readonly moduleRef: ModuleRef
    )
    { }

    async validate<T = any>(config: IUniqueConfig<T>): Promise<void>
    {
        const [only, combined] = await Promise.all([await this.only(config), await this.combined(config)]);

        const errors = {
            only,
            combined
        };

        if (only || combined)
        {
            throw new BadRequestCustomException(errors);
        }
    }

    private async only<T = any>(config: IUniqueConfig<T>)
    {
        const { repository, validate: { only }, refValue } = config;

        if (only === undefined)
        {
            return undefined;
        }

        if (Object.keys(only).length === 0)
        {
            throw new Error('UniqueService: validate.only is empty');
        }

        const _repository: BaseRepository<T> = this.moduleRef.get(repository, { strict: false });

        const onlyAttrs = Object.keys(only);

        const onlyAttrsPromises = onlyAttrs.map(async(attr) =>
        {
            if (only[<keyof T>attr])
            {
                const exist = await _repository.exist({
                    condition: { [attr]: only[<keyof T>attr] },
                    select: ['_id']
                });

                if (refValue && exist && exist._id !== refValue)
                {
                    return this.createMessage(attr);
                }
                else if (!refValue && exist)
                {
                    return this.createMessage(attr);
                }
            }
            return null;
        });

        const results = (await Promise.all(onlyAttrsPromises)).filter((result) => result !== null);

        return results.length ? results : undefined;
    }

    private async combined<T = any>(config: IUniqueConfig<T>)
    {
        const { repository, validate : { combined }, refValue } = config;

        if (combined === undefined)
        {
            return undefined;
        }

        if (!Array.isArray(combined) || !combined.length || !combined.every((item) => Object.keys(item).length >= 2))
        {
            throw new Error('UniqueService: validate.combined is not an array, is empty, or one of its component objects has fewer than 2 attributes');
        }

        const _repository: BaseRepository<T> = this.moduleRef.get(repository, { strict: false });

        const combinedAttrsPromises = combined.map(async(validate) =>
        {
            const attrs = Object.keys(validate);

            const validateObj = {};
            const props = [];

            for await (const attr of attrs)
            {
                props.push(attr);
                Object.assign(validateObj, { [attr]: validate[<keyof T> attr] ?? null });
            }

            const exist = await _repository.exist({
                condition: validateObj,
                select: ['_id']
            });

            if (refValue && exist && exist._id !== refValue)
            {
                return this.createMessage(props);
            }
            else if (!refValue && exist)
            {
                return this.createMessage(props);
            }

            return null;
        });

        const results = (await Promise.all(combinedAttrsPromises)).filter((result) => result !== null);

        return results.length ? results : undefined;
    }

    protected createMessage(attr: string | string[])
    {
        const combined = Array.isArray(attr);
        const key = combined ? 'exceptions.common.uniqueAttributes' : 'exceptions.common.uniqueAttribute';

        const message = I18nContext.current().translate(key, {
            args: {
                name: Array.isArray(attr) ? attr.join(', ') : attr
            }
        }) as string;

        return {
            [combined ? 'properties' : 'property']: attr,
            message,
            errorCode: key
        };
    }
}

