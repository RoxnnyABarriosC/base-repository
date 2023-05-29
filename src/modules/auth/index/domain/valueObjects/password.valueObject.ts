import { InvalidPasswordException } from '@modules/auth/index/domain/exceptions';
import { EncryptionFactory } from '@modules/auth/index/domain/factories';
import { EncryptionInterface } from '@modules/auth/index/domain/strategies';

export class PasswordValueObject
{
    private value: string;
    private encryption: EncryptionInterface;

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
