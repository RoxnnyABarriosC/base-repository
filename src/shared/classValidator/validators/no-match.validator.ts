import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'noMatch' })
export class NoMatchValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        const [property] = args.constraints;
        const propertyValue = args.object[property];
        return propertyValue ? value !== propertyValue : true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        return `${validationArguments.property} match with ${validationArguments.constraints}`;
    }
}
