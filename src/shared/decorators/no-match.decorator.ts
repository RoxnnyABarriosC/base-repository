import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from 'class-validator';

export function NoMatch(property: string, validationOptions?: ValidationOptions)
{
    return (object: any, propertyName: string) =>
    {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: NoMatchConstraint
        });
    };
}

@ValidatorConstraint({ name: 'noMatch' })
export class NoMatchConstraint implements ValidatorConstraintInterface
{
    validate(value: any, args: ValidationArguments)
    {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return relatedValue ? value !== relatedValue : true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string
    {
        return `${validationArguments.property} match with ${validationArguments.constraints}`;
    }
}
