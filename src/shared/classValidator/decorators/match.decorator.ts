import { ValidationOptions, registerDecorator } from 'class-validator';
import { MatchValidator } from '../validators';

export const Match = (property: string, validationOptions?: ValidationOptions) =>
{
    return (object: any, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [property],
            target: object.constructor,
            options: validationOptions,
            validator: MatchValidator
        });
    };
};

