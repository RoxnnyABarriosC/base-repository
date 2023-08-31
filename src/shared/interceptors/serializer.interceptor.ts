import {
    CallHandler,
    ClassSerializerInterceptor,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    SetMetadata
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { SerializerGroupsEnum } from '@shared/abstractClass';
import { GROUP_SERIALIZER_METHOD, SCOPE_SERIALIZER_GROUPS } from '@shared/decorators';
import { Observable, iif } from 'rxjs';

export const SCOPE_SERIALIZER = 'scope_serializer';
export const SetScopeSerializer = (scope: string) => SetMetadata(SCOPE_SERIALIZER, scope);

@Injectable()
export class SerializerInterceptor implements NestInterceptor
{
    constructor(
        private readonly reflector: Reflector,
        private readonly configService: ConfigService
    )
    { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any>
    {
        const scope = this.reflector.getAllAndOverride<string>(SCOPE_SERIALIZER, [context.getHandler(), context.getClass()]) ?? '';
        const _groups = this.reflector.getAllAndOverride<string[]>(SCOPE_SERIALIZER_GROUPS, [context.getHandler(), context.getClass()]) ?? [];
        const method = this.reflector.getAllAndOverride<string[]>(GROUP_SERIALIZER_METHOD, [context.getHandler(), context.getClass()]) ?? 'combine';

        let groups: unknown[] = [`${scope}${SerializerGroupsEnum.ID_AND_TIMESTAMP}`];

        if (_groups.length)
        {
            if (method === 'combine')
            {
                groups = [... new Set([...groups, ... _groups])];
            }
            else
            {
                groups = _groups;
            }
        }

        const serializer = new ClassSerializerInterceptor(this.reflector, {
            ... this.configService.get('serializer'),
            groups: groups as string[]
        });

        return serializer.intercept(context, next);
    }
}

