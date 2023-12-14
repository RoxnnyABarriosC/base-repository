import { ParseEmailOrPhonePipe } from '@modules/user/presentation/pipes';
import { Param } from '@nestjs/common';

export const EmailOrPhone = ((property?: string) => Param(property ?? 'emailOrPhone', new ParseEmailOrPhonePipe()));
