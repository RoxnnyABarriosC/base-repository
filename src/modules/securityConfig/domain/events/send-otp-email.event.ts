
import { OTPSendChannelEnum } from '@modules/securityConfig/domain/enums';

export class SendOTPEmailEvent
{
    constructor(
        public readonly to: string,
        public readonly channel: OTPSendChannelEnum.EMAIL,
        public readonly fullName?: string
    )
    {}
}
