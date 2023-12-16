import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
    Logger,
    HttpException as _HttpException
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CORRELATION_ID_HEADER } from '@shared/app/constants';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpException } from '../exceptions';

@Catch(HttpException, Error)
export class CustomExceptionsFilter implements ExceptionFilter
{
    private readonly logger = new Logger(CustomExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost)
    {}

    catch(exception: any, host: ArgumentsHost): void
    {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();
        const req = ctx.getRequest<FastifyRequest>();
        const res = ctx.getResponse<FastifyReply>();

        const httpStatus = exception instanceof _HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR)
        {
            this.logger.error(exception);
        }
        else if (httpStatus >= HttpStatus.BAD_REQUEST)
        {
            this.logger.warn(exception);
        }

        const args = exception['args'] ? (Object.keys(exception['args']).length ? exception['args'] : undefined) : undefined;
        const errorData = exception['errorData'] ? exception['errorData'] : undefined;

        const responseBody = {
            folio: res.getHeader(CORRELATION_ID_HEADER),
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(req),
            message: exception['errorMessage']
            ?? exception?.response?.error
            ?? exception['message'],
            errorCode: exception['errorCode'],
            internalErrorMessage: exception?.response?.message,
            args,
            data: errorData,
            requiresAllPermissions: exception['requiresAllPermissions'],
            requiredPermissions: exception['requiredPermissions']
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
