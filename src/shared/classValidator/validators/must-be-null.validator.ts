import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isNull } from 'lodash';

@ValidatorConstraint({ name: 'mustBeNull' })
export class MustBeNullValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        const [property, matchValue] = args.constraints;
        const propertyValue = args.object[property];
        return propertyValue === matchValue ? isNull(value) : true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        return '$property must be null';
    }
}
