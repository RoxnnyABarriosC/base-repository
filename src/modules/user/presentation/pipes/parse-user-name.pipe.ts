import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { userNameRegex } from '@shared/regex';

@Injectable()
export class ParseUsernamePipe implements PipeTransform<string, string>
{
    transform(value: string): string
    {
        const match = value.match(userNameRegex);

        if (!match)
        {
            throw new BadRequestException(`Invalid username format: ${value}`);
        }

        return value;
    }
}
