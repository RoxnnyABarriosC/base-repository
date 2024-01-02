import { IEncryption } from '@modules/auth/infrastructure/strategies';
import { InvalidPasswordException } from '../exceptions';
import { EncryptionFactory } from '../factories';

export class PasswordValueObject
{
    private value: string;
    private encryption: IEncryption;

    constructor(data: string, min = 3, max = 10)
    {
        this.encryption = EncryptionFactory.create();
        this.value = data;

        if (this.value.length < min || this.value.length > max)
        {
            throw new InvalidPasswordException();
        }
    }

    public async ready(): Promise<PasswordValueObject>
    {
        this.value = await this.encryption.encrypt(this.value);
        return this;
    }

    public toString = (): string =>
    {
        return this.value;
    };
}
