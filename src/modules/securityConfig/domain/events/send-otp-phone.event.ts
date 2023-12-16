import { OTPSendChannelEnum } from '../enums';

export class SendOTPPhoneEvent
{
    constructor(
        public readonly to: string,
        public readonly channel: OTPSendChannelEnum.SMS | OTPSendChannelEnum.CALL | OTPSendChannelEnum.WHATSAPP
    )
    {}
}
