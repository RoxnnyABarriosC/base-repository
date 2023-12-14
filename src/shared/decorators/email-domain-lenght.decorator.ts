import { ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

export function EmailDomainLength(minLength: number, validationOptions?: ValidationOptions)
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            name: 'emailDomainLength',
            target: object.constructor,
            propertyName,
            constraints: [minLength],
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments)
                {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    const [minLength] = args.constraints;
                    const emailDomain = value.split('@')[1];
                    const domainPart = emailDomain.split('.')[0];
                    return domainPart && domainPart.length >= minLength;
                },
                defaultMessage(args: ValidationArguments)
                {
                    return `The email domain must have at least ${args.constraints[0]} characters`;
                }
            }
        });
    };
}
