import { ValidationOptions, registerDecorator } from 'class-validator';
import { IsValidPermissionsValidator } from '../validators';

export const IsPermissionValid = (enums: any[], validationOptions?: ValidationOptions) =>
{
    return (object: object, propertyName: string) =>
    {
        registerDecorator({
            propertyName,
            constraints: [enums],
            target: object.constructor,
            options: validationOptions,
            validator: IsValidPermissionsValidator
        });
    };
};
