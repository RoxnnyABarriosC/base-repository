import { OTPSendChannelEnum, OTPTargetConfigEnum } from '@modules/securityConfig/domain/enums';

export const OTPChannelToTargetDictionary = new Map([
    [OTPSendChannelEnum.SMS, OTPTargetConfigEnum.PHONE],
    [OTPSendChannelEnum.CALL, OTPTargetConfigEnum.PHONE],
    [OTPSendChannelEnum.WHATSAPP, OTPTargetConfigEnum.PHONE],
    [OTPSendChannelEnum.EMAIL, OTPTargetConfigEnum.EMAIL]
]);
