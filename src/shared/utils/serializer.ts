import { Logger } from '@nestjs/common';
import { BaseSerializer } from '@shared/abstractClass';
import { LoggerContext } from '@shared/constants';
import { NewConstructor } from '@shared/types';
import { SerializerMap } from '@shared/utils/serializer-map';

export const Serializer = async <S extends NewConstructor<BaseSerializer >, D = any>(data: D | D[], serializer?: S | null, returnNull = true): Promise<(D | S)[] | D | S> =>
{
    const valid = !!data;

    Logger.log(`Data to serialize valid: ${valid}`, LoggerContext.SERIALIZER);

    if (serializer)
    {
        return valid ? SerializerMap(data, serializer) : returnNull ? null : undefined;
    }

    return valid ? data : returnNull ? null : undefined;
};
