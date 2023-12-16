import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LoggerContext } from '@shared/enums/logger-context';
import { RmProp } from '@shared/utils';
import { FastifyRequest } from 'fastify';
import { Observable, catchError, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';

export const SKIP_LOGGING = 'skip_logging';
export const SkipLogging = () => SetMetadata(SKIP_LOGGING, true);

@Injectable()
export class LoggerInterceptor implements NestInterceptor
{
    private readonly logger = new Logger(LoggerContext.HTTP);

    constructor(private readonly reflector: Reflector)
    {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any>
    {
        const req = context.switchToHttp().getRequest<FastifyRequest['raw']>();
        const res = context.switchToHttp().getResponse();

        const skipLogging = this.reflector.getAllAndOverride(SKIP_LOGGING, [
            context.getHandler(),
            context.getClass()
        ]) ?? false;

        if (skipLogging)
        {
            return next.handle();
        }

        const reqData = {};

        // TODO: solo mostrar informacion sensible en entornos locales o de desarrollo, para produccion esto no debe verse

        // Object.assign(reqData, { token: req.headers['authorization'] });
        Object.assign(reqData, { query: req['query'] });

        const body = { ...req['body'] };

        RmProp(body, ['password', 'currentPassword', 'passwordConfirmation']);

        Object.assign(reqData, { body });

        this.logger.log(`Request ${req.method} ${req.url}`);
        this.logger.log(reqData);

        return next.handle().pipe(
            tap(() => this.logger.log(`Response ${res.statusCode}`)),
            catchError(error =>
            {
                return throwError(() => error);
            })
        );
    }
}
