import { IMyStore } from '@modules/common/store';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor, SetMetadata
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAppResponse } from '@shared/interceptors';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const NOT_INTERCEPT_RESPONSE = 'not_intercept_response';
export const NotInterceptResponse = () => SetMetadata(NOT_INTERCEPT_RESPONSE, true);

@Injectable()
export class ResponseInterceptor implements NestInterceptor
{
    constructor(
        private readonly store: ClsService<IMyStore>,
        private readonly reflector: Reflector
    )
    {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<IAppResponse>
    {
        const notInterceptResponse = this.reflector.getAllAndOverride(NOT_INTERCEPT_RESPONSE, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        if (notInterceptResponse)
        {
            return next.handle();
        }

        return next.handle().pipe(
            map((data: unknown | unknown[]) =>
            {
                const res = context.switchToHttp().getResponse<FastifyReply>();

                return <IAppResponse>{
                    folio: res.getHeader('x-correlation-id').toString(),
                    isArray: Array.isArray(data),
                    isCached: false,
                    data,
                    pagination: this.store.get('res.pagination') ?? undefined,
                    metadata: this.store.get('res.metadata') ?? undefined
                };
            })
        );
    }
}
