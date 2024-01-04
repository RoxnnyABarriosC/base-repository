import { applyDecorators } from '@nestjs/common';
import { stringTrim } from '@shared/regex';
import { PrototypeToString, StringPrototypes } from '@shared/utils';
import { Transform } from 'class-transformer';

export const Trim = () =>
{
    return applyDecorators(
        Transform(({ value }) =>
        {
            if (!PrototypeToString(value, StringPrototypes.STRING))
            {
                return value;
            }

            return value.replaceAll(stringTrim, ' ').trim();
        })
    );
};
