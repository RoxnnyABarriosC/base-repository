import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isEmail } from 'class-validator';

@ValidatorConstraint({ name: 'emailDomainLength' })
export class EmailDomainLengthValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        if (!isEmail(value))
        {
            return true;
        }

        const [minLength] = args.constraints;
        const emailDomain = value.split('@')[1];
        const domainPart = emailDomain.split('.')[0];
        return domainPart && domainPart.length >= minLength;
    }

    defaultMessage(args: ValidationArguments)
    {
        return `The email domain must have at least ${args.constraints[0]} characters`;
    }
}
