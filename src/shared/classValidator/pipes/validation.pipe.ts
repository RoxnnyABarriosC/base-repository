import configuration from '@config/configuration';
import { ValidationPipe as DTOValidation } from '@nestjs/common';
import { MapperErrorModels } from '../utils';

const  { classValidator } = configuration();
export const ValidationPipe = (...groups: string[]) =>
{
    return new DTOValidation({
        ...classValidator,
        ...(groups.length ? { groups } : {}),
        transformOptions: {
            ...(groups.length ? { groups } : {})
        },
        exceptionFactory: MapperErrorModels
    });
};
