import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'match' })
export class MatchValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        const [property] = args.constraints;
        const propertyValue = args.object[property];
        return propertyValue ? value === propertyValue : true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        return `${validationArguments.property} no match with ${validationArguments.constraints}`;
    }
}
