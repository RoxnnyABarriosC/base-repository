import { ValidationArguments, registerDecorator } from 'class-validator';

export const getPermissions = (...enums: any[]) =>
{
    return  enums.reduce((acc: any[], _enum: any) => [...new Set([...acc, ... Object.values(_enum)])], []);
};

export function IsPermissionValid(...enums: any[])
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            target: object.constructor,
            name: 'isPermissionValid',
            propertyName,
            validator: {
                validate(value: string[], args: ValidationArguments)
                {
                    const permissions: string[] = getPermissions(...enums);

                    return value.every(permission => permissions.some(permissionEnum => permissionEnum === permission));
                },
                defaultMessage(args: ValidationArguments)
                {
                    return 'Some of the permissions added do not match the permissions allowed.';
                }
            }
        });
    };
}
