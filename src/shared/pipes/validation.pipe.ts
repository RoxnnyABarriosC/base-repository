import { ValidationPipe as DTOValidation } from '@nestjs/common';
import { BadRequestCustomException } from '@shared/exceptions';
import { ErrorModel } from '@shared/models';
import _ from 'lodash';

export const ValidationPipe = () =>
{
    return new DTOValidation({
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        exceptionFactory: (errors) =>
        {
            const validationModels: ErrorModel[] = [];
            if (!_.isEmpty(errors))
            {
                for (const error of errors)
                {
                    const validationModel = new ErrorModel(error);
                    validationModels.push(validationModel);
                }
            }

            return new BadRequestCustomException(validationModels);
        }
    });
};
