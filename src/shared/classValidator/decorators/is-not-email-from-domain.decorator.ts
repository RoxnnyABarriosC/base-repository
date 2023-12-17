import { IsNotEmailFromDomainValidator } from '@shared/classValidator/validators';
import { ValidationOptions, registerDecorator } from 'class-validator';

export const IsNotEmailFromDomain = (domains: string | string[], validationOptions?: ValidationOptions) =>
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            propertyName,
            constraints: [domains],
            target: object.constructor,
            options: validationOptions,
            validator: IsNotEmailFromDomainValidator
        });
    };
};


