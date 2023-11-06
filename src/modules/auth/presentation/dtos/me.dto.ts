import { UserDto } from '@modules/user/presentation/dtos';
import { OmitType } from '@nestjs/swagger';

export class MeDto extends OmitType(UserDto, ['password', 'passwordConfirmation'])
{}
