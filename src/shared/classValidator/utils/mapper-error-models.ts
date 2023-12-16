import { BadRequestCustomException } from '@src/shared/app/exceptions';
import { ValidationError } from 'class-validator';
import _ from 'lodash';
import { ErrorModel } from '../models';
export const MapperErrorModels = (errors: ValidationError[], initTrow = false) =>
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
