import { ParseUsernamePipe } from '@modules/user/presentation/pipes';
import { Param } from '@nestjs/common';

export const UserName = ((property?: string) => Param(property ?? 'userName', new ParseUsernamePipe()));
