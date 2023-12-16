import { IMyStore } from '@modules/common/store';
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyReply } from 'fastify';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NOT_INTERCEPT_RESPONSE } from '../decorators';
import { IAppResponse } from './response-interceptor.interface';


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
