import { Param, ParseUUIDPipe } from '@nestjs/common';

export const UUID = ((property?: string) => Param(property ?? 'id', new ParseUUIDPipe({ version: '4' })));
