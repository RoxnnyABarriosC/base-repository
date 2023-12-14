import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { emailOrPhoneRegex } from '@shared/regex';

@Injectable()
export class ParseEmailOrPhonePipe implements PipeTransform<string, string>
{
    transform(value: string): string
    {
        const match = value.match(emailOrPhoneRegex);

        if (!match)
        {
            throw new BadRequestException(`Invalid emailOrPhone format: ${value}`);
        }

        return value;
    }
}
