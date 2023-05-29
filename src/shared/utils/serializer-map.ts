import { Logger } from '@nestjs/common';
import { BaseSerializer } from '@shared/abstractClass';
import { ErrorContext } from '@shared/constants';
import { NewConstructor } from '@shared/types';

export const SerializerMap = async <S extends NewConstructor<BaseSerializer>, D = any>(data: D | D[], serializer?: S | null): Promise<(D | S)[] | D | S> =>
{
    let result: any[] | any = [];

    if (!serializer)
    {
        Logger.log('Returning plain data...', ErrorContext.SERIALIZER);
        return data;
    }

    Logger.log('Serializing the data...', ErrorContext.SERIALIZER);

    if (typeof data[Symbol.iterator] === 'function')
    {
        for await (const element of data as any[])
        {
            const _serializer = new serializer();
            await _serializer.build(element);
            result.push(_serializer);
        }
    }
    else
    {
        const _serializer = new serializer();
        await _serializer.build(data);
        result = _serializer;
    }

    Logger.log('Returning serialized data...', ErrorContext.SERIALIZER);

    return result;
};
