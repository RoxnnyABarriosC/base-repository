import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isDateString } from 'class-validator';

@ValidatorConstraint({ name: 'isAgeBetween' })
export class IsAgeBetweenValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        if (!isDateString(value))
        {
            return false;
        }

        const [min, max] = args.constraints as [number, number];
        const birthDate = new Date(value);
        const oldEnough = new Date();
        oldEnough.setFullYear(oldEnough.getFullYear() - min);
        const tooOld = new Date();
        tooOld.setFullYear(tooOld.getFullYear() - max);
        return birthDate <= oldEnough && birthDate >= tooOld;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        const [min, max] = validationArguments.constraints as [number, number];
        return `The age must be between ${min} and ${max} years old`;
    }
}
