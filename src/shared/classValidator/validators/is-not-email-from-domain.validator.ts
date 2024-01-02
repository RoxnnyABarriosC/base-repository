import { getEmailDomain } from '@shared/utils';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isEmail } from 'class-validator';

@ValidatorConstraint({ name: 'isNotEmailFromDomain' })
export class IsNotEmailFromDomainValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        if (!isEmail(value))
        {
            return true;
        }

        const [domains] = args.constraints;

        const emailDomain = getEmailDomain(value);

        if (Array.isArray(domains))
        {
            return !domains.some(d => d === emailDomain);
        }

        return emailDomain !== domains;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        const [domains] = validationArguments.constraints;
        return `The email must not be from the domain ${domains}`;
    }
}
