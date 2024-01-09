import configuration from '@config/configuration';
import { instanceToPlain } from 'class-transformer';
import { SerializerGroupsEnum } from './../enums';
import { Serializer } from './serializer';

const serializer = configuration().serializer;

export interface IWSSerializer {
    instance: any;
    scope?: string;
    groups?: string[];
    method?: 'combine' | 'override';
}
export const WSSerializer = async <T = any>(data: any, { instance, ...config }: IWSSerializer): Promise<T> =>
{
    if (instance)
    {
        const { scope, groups = [], method = 'override' } = config;

        let _groups: unknown[] = [`${scope}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`];

        if (groups.length)
        {
            if (method === 'combine')
            {
                _groups = [... new Set([..._groups, ... groups])];
            }
            else
            {
                _groups = groups;
            }
        }

        data = instanceToPlain(await Serializer(data, instance), { ...serializer, groups: _groups as string[] });
    }

    return data;
};
