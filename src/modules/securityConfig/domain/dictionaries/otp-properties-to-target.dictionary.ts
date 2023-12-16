import { OTPPropertiesEnum, OTPTargetConfigEnum } from '../enums';

export const OTPPropertiesToTargetDictionary = new Map([
    [OTPPropertiesEnum.PHONE_OTP_CODE, OTPTargetConfigEnum.PHONE],
    [OTPPropertiesEnum.EMAIL_OTP_CODE, OTPTargetConfigEnum.EMAIL]
]);
