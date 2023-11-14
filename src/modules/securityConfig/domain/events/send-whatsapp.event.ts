import { OTPProvidersEnum } from '@modules/securityConfig/domain/enums';

export class SendWhatsappEvent
{
    constructor(
        public readonly providers: OTPProvidersEnum[],
        public readonly message: string,
        public readonly to: string
    )
    {}
}
