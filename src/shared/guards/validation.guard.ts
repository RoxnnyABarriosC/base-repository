import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { APPLY_VALIDATION_BODY_KEY, SCOPE_PIPE_GROUPS } from '@shared/decorators';
import { mapperErrorModels } from '@shared/pipes';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import { FastifyRequest } from 'fastify';

@Injectable()
export class ValidationGuard implements CanActivate
{
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService
    )
    {}

    async canActivate(context: ExecutionContext): Promise<boolean>
    {
        const { body } = context.switchToHttp().getRequest<FastifyRequest>();
        const options = this.configService.getOrThrow<ValidatorOptions>('classValidator');

        const targetBody = this.reflector.get(APPLY_VALIDATION_BODY_KEY, context.getHandler());
        const groups = this.reflector.getAllAndOverride<string[]>(SCOPE_PIPE_GROUPS, [context.getHandler(), context.getClass()]) ?? [];

        if (targetBody)
        {
            mapperErrorModels(await validate(plainToInstance(targetBody, body), {
                ...options,
                ...(groups.length ? { groups } : {})
            }), true);
        }

        return true;
    }
}
