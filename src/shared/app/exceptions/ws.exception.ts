import { HttpStatus } from '@nestjs/common';
import { WsException as _WsException } from '@nestjs/websockets';
import { I18nContext } from 'nestjs-i18n';

export class WsException extends _WsException
{
    private readonly errorMessage: string;

    constructor(private readonly statusCode: HttpStatus, private readonly errorCode: string, private readonly args?: object)
    {
        const errorMessage: string = I18nContext.current()?.translate(errorCode, {
            args
        }) ?? null;

        super(
            {
                errorCode,
                errorMessage
            }
        );

        this.errorMessage = errorMessage;
    }
}
