import crypto from 'crypto';

export const GenerateApiKey = (size = 20) =>
{
    return crypto.randomBytes(size).toString('hex');
};
