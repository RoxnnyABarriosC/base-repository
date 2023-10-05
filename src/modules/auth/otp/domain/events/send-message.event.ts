export class SendMessageEvent
{
    constructor(
        public readonly message: string,
        public readonly to: string
    )
    {}
}
