
export class SendPublicOtpEvent
{
    constructor(
        public readonly email: string,
        public readonly otp: string
    )
    {}
}
