import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEmail, registerDecorator } from 'class-validator';

export function IsEmailFromDomain(domains: string | string[], validationOptions?: ValidationOptions)
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            name: 'isEmailFromDomain',
            target: object.constructor,
            propertyName,
            constraints: [domains],
            options: validationOptions,
            validator: IsEmailFromDomainConstraint
        });
    };
}


@ValidatorConstraint({ name: 'isEmailFromDomain' })
export class IsEmailFromDomainConstraint implements ValidatorConstraintInterface
{
    validate(value: any, args: ValidationArguments)
    {
        const [expectedDomain] = args.constraints;

        if (!isEmail(value))
        {
            return true;
        }

        const emailDomain = value.split('@')[1];

        if (Array.isArray(expectedDomain))
        {
            return expectedDomain.some(d => d === emailDomain);
        }

        return emailDomain === expectedDomain;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        const [expectedDomain] = validationArguments.constraints;
        return `The email must be from the domain ${expectedDomain}`;
    }
}
