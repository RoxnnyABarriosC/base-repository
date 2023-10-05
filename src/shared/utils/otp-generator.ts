import { ALPHA_NUMERIC_CHARS, CHARS, NUMERIC_CHARS } from '@shared/constants';
import { randomBytes } from 'crypto';
export const OtpGenerator = (length = 4, isNumeric = true): string =>
{
    const chars = isNumeric ? NUMERIC_CHARS : ALPHA_NUMERIC_CHARS;

    let otp = '';

    while (otp.length < length)
    {
        const bytes = randomBytes(1);

        const index = bytes[0] % chars.length;

        if (index < chars.length)
        {
            otp += chars[index];
        }
    }

    return otp;
};
