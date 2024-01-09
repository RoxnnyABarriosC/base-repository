import { I18nTranslations } from '@config/locales/i18n.generated';
import { ArgumentsHost, Catch, HttpStatus, Logger, HttpException as _HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WsException as _WsException } from '@nestjs/websockets/errors/ws-exception';
import { I18nContext } from 'nestjs-i18n';
import { Socket } from 'socket.io';
import { HttpException, WsException } from '../exceptions';


@Catch(HttpException, WsException, Error, _HttpException, _WsException)
export class WsCustomExceptionFilter extends BaseExceptionFilter
{
    private readonly logger = new Logger(WsCustomExceptionFilter.name);

    private i18nContext: I18nContext<I18nTranslations>;

    override catch(exception: unknown, host: ArgumentsHost)
    {
        this.i18nContext = host.getArgByIndex(0).i18nContext as I18nContext<I18nTranslations>;

        this.handleTranslations(exception);

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

        const responseData = {
            timestamp: new Date().toISOString(),
            event: host.getArgByIndex(3),
            errorCode: exception['errorCode'],
            message: exception['errorMessage']
              ?? exception['response']?.error
              ?? exception['message'],
            args,
            data: errorData,
            requiresAllPermissions: exception['requiresAllPermissions'],
            requiredPermissions: exception['requiredPermissions']
        };

        const client: Socket = host.switchToWs().getClient();

        client.emit('exception', responseData, httpStatus);
    }


    private handleTranslations(exception: any): void
    {
        if (exception instanceof HttpException)
        {
            const errorMessage = this.i18nContext.translate(exception['errorCode'] as any, {
                args: exception['args']
            }) as string;

            // @ts-ignore
            exception['errorMessage'] = errorMessage;

            exception['response']['errorMessage'] = errorMessage;
        }

        else if (exception instanceof WsException)
        {
            const errorMessage = this.i18nContext.translate(exception['errorCode'] as any, {
                args: exception['args']
            }) as string;

            // @ts-ignore
            exception['errorMessage'] = errorMessage;
        }
    }
}
