import { GenerateApiKey, GetMilliseconds, OtpGenerator, addTimeToCurrentDate } from '@shared/utils';

declare interface IOTPModelPros {
    length?: number;
    isNumeric?: false;
}

export class OTPModel
{
    private readonly code: string;
    private readonly key: string;
    private hash: string;


    constructor(
        private readonly expirationTime: string,
        private readonly encrypt: (chain: string) => Promise<string>,
        { length, isNumeric }: IOTPModelPros = {}
    )
    {
        this.code = OtpGenerator(length, isNumeric);
        this.key = GenerateApiKey();
    }

    public get Code()
    {
        return this.code;
    }

    public get Key()
    {
        return this.key;
    }

    public get Hash()
    {
        return this.hash;
    }

    public ExpirationTime(option: 'ms' | 'date')
    {
        const expirationTime = this.expirationTime;

        const options = {
            ms:  GetMilliseconds(expirationTime),
            date: addTimeToCurrentDate(expirationTime).utc().toDate()
        };

        return options[option] ?? expirationTime;
    }

    public async build()
    {
        this.hash = await this.encrypt(this.code);
    }
}
