import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isPrivate' })
export class IsPrivateValidator implements ValidatorConstraintInterface
{
    validate()
    {
        return false;
    }
    defaultMessage()
    {
        return 'The property $property is private and cannot be used in this context';
    }
}
