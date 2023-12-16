import { HttpStatus, HttpException as _HttpException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';

export class HttpException extends _HttpException
{
    private readonly errorMessage: string;

    constructor(private readonly statusCode: HttpStatus, private readonly errorCode: string, private readonly args?: object)
    {
        const errorMessage = I18nContext.current().translate(errorCode, {
            args
        }) as string;

        super(
            {
                errorCode,
                errorMessage
            },
            statusCode
        );

        this.errorMessage = errorMessage;
    }
}
