import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function IsPrivate(validationOptions?: ValidationOptions)
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            name: 'isPrivate',
            target: object.constructor,
            propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments)
                {
                    return value === undefined;
                },
                defaultMessage()
                {
                    return 'the property $property is private and cannot be used in this context';
                }
            }
        });
    };
}
