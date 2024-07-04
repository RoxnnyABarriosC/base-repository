import { Logger } from '@nestjs/common';
import { LoggerContext } from '@shared/enums/logger-context';
import { NewConstructor } from '@shared/types';
import { BaseSerializer } from '../abstractClass';

/**
 * This function serializes an array of data or a single data value using a specified serializer class.
 * @async
 * @param {D | D[]} data - The data to be serialized.
 * @param {S | null} [serializer] - The serializer class to be used for serializing the data.
 * @returns {Promise<(D | S)[] | D | S>} A promise that resolves to the serialized data, or the original data if no serializer is provided.
 * @template S
 * @template D
 */
export const SerializerMap = async <S extends NewConstructor<BaseSerializer>, D = any>(data: D | D[], serializer?: S | null): Promise<(D | S)[] | D | S> =>
{
    let result: any[] | any = [];

    if (!serializer)
    {
        return data;
    }

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

    return result;
};
