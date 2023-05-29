import { UserDto } from '@modules/auth/user/presentation/dtos';
import { OmitType } from '@nestjs/swagger';

export class MeDto extends OmitType(UserDto, ['password', 'passwordConfirmation'])
{}
