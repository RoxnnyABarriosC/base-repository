import configuration from '@config/configuration';
import { ValidationPipe as DTOValidation } from '@nestjs/common';
import { BadRequestCustomException } from '@shared/exceptions';
import { ErrorModel } from '@shared/models';
import { ValidationError } from 'class-validator';
import _ from 'lodash';

const  { classValidator } = configuration();

export const mapperErrorModels = (errors: ValidationError[], initTrow = false) =>
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

    if (initTrow && validationModels.length)
    {
        throw new BadRequestCustomException(validationModels);
    }
    else
    {
        return new BadRequestCustomException(validationModels);
    }
};

export const ValidationPipe = () =>
{
    return new DTOValidation({
        ...classValidator,
        exceptionFactory: mapperErrorModels
    });
};

