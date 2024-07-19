import { IsMobilePhone, IsString, Length } from 'class-validator';

export class ChangeMyPhoneDto
{
    @IsMobilePhone()
    public readonly phone: string;

    @IsString()
    @Length(6, 6)
    public readonly otpCode: string;
}
