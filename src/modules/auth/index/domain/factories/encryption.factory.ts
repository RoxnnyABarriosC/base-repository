import configuration from '@config/configuration';
import {
    BcryptEncryptionStrategy,
    EncryptionInterface,
    Md5EncryptionStrategy
} from '@modules/auth/index/domain/strategies';

export class EncryptionFactory
{
    static create(encryptionConfig?: 'bcrypt' | 'md5'): EncryptionInterface
    {
        const encryptions: Record<string, any>  = {
            bcrypt: BcryptEncryptionStrategy,
            md5: Md5EncryptionStrategy
        };

        return new encryptions[encryptionConfig ?? configuration().encryption.default]();
    }
}
