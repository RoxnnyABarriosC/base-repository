import { OTPPropertiesEnum, OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';

export const OTPPropertiesToTargetDictionary = new Map([
    [OTPPropertiesEnum.PHONE_OTP_CODE, OTPTargetConfigEnum.PHONE],
    [OTPPropertiesEnum.EMAIL_OTP_CODE, OTPTargetConfigEnum.EMAIL]
]);
