import { registerDecorator } from 'class-validator';
import { IsPrivateValidator } from '../validators';

export const IsPrivate = () =>
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            propertyName,
            target: object.constructor,
            validator: IsPrivateValidator
        });
    };
};
