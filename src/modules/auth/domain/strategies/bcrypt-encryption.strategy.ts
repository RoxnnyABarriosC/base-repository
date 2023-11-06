import configuration from '@config/configuration';
import { DecryptForbiddenException } from '@modules/auth/domain/exceptions';
import bcrypt from 'bcrypt';
import { IEncryption } from './encryption.inferface';

const config = configuration();

export class BcryptEncryptionStrategy implements IEncryption
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

