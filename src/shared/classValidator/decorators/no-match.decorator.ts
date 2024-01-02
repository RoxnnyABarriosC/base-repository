import { ValidationOptions, registerDecorator } from 'class-validator';
import { NoMatchValidator } from '../validators';

export const NoMatch = (property: string, validationOptions?: ValidationOptions) =>
{
    return (object: any, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [property],
            target: object.constructor,
            options: validationOptions,
            validator: NoMatchValidator
        });
    };
};

