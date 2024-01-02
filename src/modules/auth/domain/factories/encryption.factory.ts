import configuration from '@config/configuration';
import { BcryptEncryptionStrategy, IEncryption, Md5EncryptionStrategy } from '@modules/auth/infrastructure/strategies';

export class EncryptionFactory
{
    static create(encryptionConfig?: 'bcrypt' | 'md5'): IEncryption
    {
        const encryptions: Record<string, any>  = {
            bcrypt: BcryptEncryptionStrategy,
            md5: Md5EncryptionStrategy
        };

        return new encryptions[encryptionConfig ?? configuration().encryption.default]();
    }
}
