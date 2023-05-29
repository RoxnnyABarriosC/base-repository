import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends OmitType(UserDto, ['password', 'passwordConfirmation'])
{}
