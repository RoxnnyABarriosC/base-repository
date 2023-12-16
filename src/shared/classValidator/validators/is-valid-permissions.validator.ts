import { getPermissions } from '@shared/app/utils';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, isString } from 'class-validator';

@ValidatorConstraint({ name: 'isValidPermissions' })
export class IsValidPermissionsValidator implements ValidatorConstraintInterface
{
    validate(value: string, args: ValidationArguments)
    {
        if (!isString(value))
        {
            return false;
        }

        const [enums] = args.constraints;
        const permissions: string[] = getPermissions(...enums);
        return permissions.some(permission => permission === value);
    }
    defaultMessage()
    {
        return 'Some of the permissions added do not match the permissions allowed.';
    }
}
