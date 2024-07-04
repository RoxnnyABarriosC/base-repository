import { BadRequestException, Injectable, Param, PipeTransform } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
class ParseEmailPipe implements PipeTransform<string, string>
{
    transform(value: string): string
    {
        const match = isEmail(value);

        if (!match)
        {
            throw new BadRequestException(`Invalid email format: ${value}`);
        }

        return value;
    }
}


export const Email = ((property?: string) => Param(property ?? 'email', new ParseEmailPipe()));
