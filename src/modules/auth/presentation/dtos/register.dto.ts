import { UserDto } from '@modules/user/presentation/dtos';
import { OmitType } from '@nestjs/swagger';
import { IsMobilePhone } from 'class-validator';

export class RegisterDto extends OmitType(UserDto, ['userName', 'phone'] as const)
{
    @IsMobilePhone()
    public readonly phone: string;
}
