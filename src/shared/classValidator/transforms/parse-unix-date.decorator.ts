import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
export const  ParseUnixDate = () =>
{
    return applyDecorators(Transform(({ value }) =>
    {
        dayjs.extend(utc);

        if (value)
        {
            value = dayjs(value).utc().unix();
        }

        return value;
    }));
};
