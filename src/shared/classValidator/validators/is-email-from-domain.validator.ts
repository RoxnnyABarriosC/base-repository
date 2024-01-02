import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isEmail } from 'class-validator';

@ValidatorConstraint({ name: 'isEmailFromDomain' })
export class IsEmailFromDomainValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        if (!isEmail(value))
        {
            return true;
        }

        const [domains] = args.constraints;

        const emailDomain = value.split('@')[1];

        if (Array.isArray(domains))
        {
            return domains.some(d => d === emailDomain);
        }

        return emailDomain === domains;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        const [domains] = validationArguments.constraints;
        return `The email must be from the domain ${domains}`;
    }
}
