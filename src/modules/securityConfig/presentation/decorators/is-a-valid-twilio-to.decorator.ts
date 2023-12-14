import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, isEmail, isMobilePhone, registerDecorator } from 'class-validator';

export function IsAValidTwilioTo(validationOptions?: ValidationOptions)
{
    return function(object: object, propertyName: string)
    {
        registerDecorator({
            name: 'isAValidTwilioTo',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: isAValidTwilioToConstrain
        });
    };
}

@ValidatorConstraint({ name: 'isAValidTwilioTo' })
export class isAValidTwilioToConstrain implements ValidatorConstraintInterface
{
    validate(to: string, args: ValidationArguments)
    {
        if (args.object['channel'] && args.object['channel'] === OTPSendChannelEnum.EMAIL)
        {
            return isEmail(to);
        }

        if (args.object['channel'] && [
            OTPSendChannelEnum.SMS,
            OTPSendChannelEnum.CALL,
            OTPSendChannelEnum.WHATSAPP
        ].some(channel => args.object['channel'] === channel))
        {
            return isMobilePhone(to);
        }
    }
    defaultMessage(args: ValidationArguments)
    {
        return 'Enter a valid $property.';
    }
}
