import { User } from '@modules/user/domain/entities';
import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services';

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
        return await this.authService.localAuthenticate(emailOrPhone.toLowerCase(), password);
    }
}
