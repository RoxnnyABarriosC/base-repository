import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

export function IsAgeBetween(min: number, max: number, validationOptions?: ValidationOptions)
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            name: 'isAgeBetween',
            target: object.constructor,
            propertyName,
            constraints: [min, max],
            options: validationOptions,
            validator: IsAgeBetweenConstraint
        });
    };
}


@ValidatorConstraint({ name: 'isAgeBetween' })
export class IsAgeBetweenConstraint implements ValidatorConstraintInterface
{
    validate(value: any, args: ValidationArguments)
    {
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
