import configuration from '@config/configuration';
import { Match, NoMatch } from '@shared/classValidator/decorators';
import { passwordRegex } from '@shared/regex';
import { IsString, Length, Matches } from 'class-validator';

const { min, max } = configuration().validatorProperties.password;

export class PasswordDto
{
    @IsString()
    @Length(min, max)
    @Matches(passwordRegex)
    @NoMatch('currentPassword')
    public password: string;

    @IsString()
    @Length(min, max)
    @Matches(passwordRegex)
    @Match('password')
    public passwordConfirmation: string;
}
