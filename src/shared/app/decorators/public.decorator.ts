import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const IS_PUBLIC_KEY = 'is_public_key';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const checkIsPublic = (context: ExecutionContext, reflector: Reflector) =>
{
    return reflector.getAllAndOverride(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass()
    ]) ?? false;
};
