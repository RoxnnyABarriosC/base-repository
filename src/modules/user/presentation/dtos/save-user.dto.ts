import { OmitType } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';
import { UserDto } from './user.dto';

export class SaveUserDto extends OmitType(UserDto, ['password', 'passwordConfirmation'])
{
    @IsBoolean()
    public enable: boolean;
}
