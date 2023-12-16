import { Param } from '@nestjs/common';
import { ParseEmailOrPhonePipe } from '../pipes';

export const EmailOrPhone = ((property?: string) => Param(property ?? 'emailOrPhone', new ParseEmailOrPhonePipe()));
