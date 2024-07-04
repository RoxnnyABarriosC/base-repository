import { Logger } from '@nestjs/common';
import { LoggerContext } from '@shared/enums/logger-context';
import { NewConstructor } from '@shared/types';
import { BaseSerializer } from '../abstractClass';
import { SerializerMap } from './serializer-map';

/**
 * This function serializes data using a specified serializer class, or returns the data as-is if no serializer is provided.
 * @async
 * @param {D | D[]} data - The data to be serialized.
 * @param {S | null} [serializer] - The serializer class to be used for serializing the data.
 * @param {boolean} [returnNull=true] - Whether to return null or undefined if the data is not valid.
 * @returns {Promise<(D | S)[] | D | S>} A promise that resolves to the serialized data, or the original data if no serializer is provided.
 * @template S
 * @template D
 */

export const Serializer = async <S extends NewConstructor<BaseSerializer>, D = any>(data: D | D[], serializer?: S | null, returnNull = true): Promise<(D | S)[] | D | S> =>
{
    const valid = !!data;

    if (serializer)
    {
        return valid ? SerializerMap(data, serializer) : returnNull ? null : undefined;
    }

    return valid ? data : returnNull ? null : undefined;
};
