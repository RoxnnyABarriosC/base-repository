import { DefaultValuePipe, ParseBoolPipe, Query, ValidationPipe } from '@nestjs/common';

export const PartialRemoved = (() =>  Query(
    'partialRemoved',
    new ValidationPipe({ transform: true, whitelist: true }),
    new ParseBoolPipe({ optional: true }),
    new DefaultValuePipe(false)
));
