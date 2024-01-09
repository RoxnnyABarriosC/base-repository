import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { checkIsPublic } from '@shared/app/decorators';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt')
{
    constructor(
        private reflector: Reflector
    )
    {
        super();
    }

    override canActivate(context: ExecutionContext)
    {
        if (checkIsPublic(context, this.reflector))
        {
            return true;
        }

        return super.canActivate(context);
    }
}
