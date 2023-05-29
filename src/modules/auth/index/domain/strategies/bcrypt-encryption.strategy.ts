import configuration from '@config/configuration';
import { DecryptForbiddenException } from '@modules/auth/index/domain/exceptions';
import bcrypt from 'bcrypt';
import { EncryptionInterface } from './encryption.inferface';

const config = configuration();

export class BcryptEncryptionStrategy implements EncryptionInterface
{
    async compare(chain: string, chainHashed: string): Promise<boolean>
    {
        return await bcrypt.compare(chain, chainHashed);
    }

    async decrypt(chain: string): Promise<string>
    {
        throw new DecryptForbiddenException();
    }

    async encrypt(chain: string): Promise<string>
    {
        const saltRounds: number = config.encryption.bcrypt.saltRounds;
        return await bcrypt.hash(chain, saltRounds);
    }
}

