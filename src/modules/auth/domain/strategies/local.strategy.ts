import { AuthService } from '@modules/auth/domain/services';
import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy)
{
    private readonly logger = new Logger(LocalStrategy.name);

    constructor(
        private readonly authService: AuthService
    )
    {
        super({ usernameField: 'emailOrPhone' });
    }

    async validate(emailOrPhone: string, password: string): Promise<User | void>
    {
        return await this.authService.validateUser(emailOrPhone.toLowerCase(), password);
    }
}
