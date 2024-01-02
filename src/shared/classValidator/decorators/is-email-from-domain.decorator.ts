import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsEmailFromDomainValidator } from '../validators';

export const IsEmailFromDomain = (domains: string | string[], validationOptions?: ValidationOptions) =>
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            propertyName,
            constraints: [domains],
            target: object.constructor,
            options: validationOptions,
            validator: IsEmailFromDomainValidator
        });
    };
};


