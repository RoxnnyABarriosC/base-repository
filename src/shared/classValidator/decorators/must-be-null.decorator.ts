import { MustBeNullValidator } from '@shared/classValidator/validators/must-be-null.validator';
import {  ValidationOptions, registerDecorator } from 'class-validator';

export const MustBeNull = (property: string, matchValue: null | undefined | string | boolean, validationOptions?: ValidationOptions) =>
{
    return (object: object, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [property, matchValue],
            target: object.constructor,
            options: validationOptions,
            validator: MustBeNullValidator
        });
    };
};
