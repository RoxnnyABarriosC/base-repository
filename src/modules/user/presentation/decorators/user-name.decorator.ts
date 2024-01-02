import { Param } from '@nestjs/common';
import { ParseUsernamePipe } from '../pipes';

export const UserName = ((property?: string) => Param(property ?? 'userName', new ParseUsernamePipe()));
