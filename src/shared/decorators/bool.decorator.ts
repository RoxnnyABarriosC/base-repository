import { Param, ParseBoolPipe } from '@nestjs/common';

export const Bool = ((property?: string) => Param(property ?? 'enable', new ParseBoolPipe()));
