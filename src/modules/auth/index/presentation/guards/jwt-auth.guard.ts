import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { checkIsPublic } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt')
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
