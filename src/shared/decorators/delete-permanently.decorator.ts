import { DefaultValuePipe, ParseBoolPipe, Query, ValidationPipe } from '@nestjs/common';

export const DeletePermanently = (() =>  Query(
    'deletePermanently',
    new ValidationPipe({ transform: true, whitelist: true }),
    new ParseBoolPipe({ optional: true }),
    new DefaultValuePipe(false)
));
