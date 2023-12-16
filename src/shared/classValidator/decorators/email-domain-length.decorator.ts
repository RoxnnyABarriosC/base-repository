import {  ValidationOptions, registerDecorator } from 'class-validator';
import { EmailDomainLengthValidator } from '../validators';

export const EmailDomainLength = (minLength: number, validationOptions?: ValidationOptions) =>
{
    return (object: object, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [minLength],
            target: object.constructor,
            options: validationOptions,
            validator: EmailDomainLengthValidator
        });
    };
};
