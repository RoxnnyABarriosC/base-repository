import { OtpProvidersEnum } from '@modules/auth/otp/domain/enums';

export class SendWhatsappEvent
{
    constructor(
        public readonly providers: OtpProvidersEnum[],
        public readonly message: string,
        public readonly to: string
    )
    {}
}
