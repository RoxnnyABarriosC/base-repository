import { UserDto } from '@modules/user/presentation/dtos';
import { PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class OTPRegisterDto extends PickType(UserDto, ['email', 'password', 'passwordConfirmation'] as const)
{
    @IsString()
    @Length(6, 6)
    public readonly otpCode: string;
}
