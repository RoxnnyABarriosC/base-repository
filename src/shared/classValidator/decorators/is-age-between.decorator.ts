import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsAgeBetweenValidator } from '../validators';

export const IsAgeBetween = (min: number, max: number, validationOptions?: ValidationOptions) =>
{
    return (object: object, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [min, max],
            target: object.constructor,
            options: validationOptions,
            validator: IsAgeBetweenValidator
        });
    };
};


