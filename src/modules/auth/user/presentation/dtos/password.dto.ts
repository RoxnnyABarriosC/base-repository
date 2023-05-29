import { IsString, Length } from 'class-validator';
export class PasswordDto
{
    @IsString()
    @Length(5, 20)
    public password: string;

    @IsString()
    @Length(5, 20)
    public passwordConfirmation: string;
}
