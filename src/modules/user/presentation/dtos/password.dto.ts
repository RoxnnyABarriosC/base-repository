import { Match, NoMatch } from '@shared/decorators';
import { IsString, Length } from 'class-validator';

export class PasswordDto
{
    @IsString()
    @Length(5, 20)
    @NoMatch('currentPassword')
    public password: string;

    @IsString()
    @Length(5, 20)
    @Match('password')
    public passwordConfirmation: string;
}
