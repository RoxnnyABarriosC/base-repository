import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@shared/exceptions/http.exception';

export class BadRequestCustomException extends HttpException
{
    constructor(private readonly errorData: unknown)
    {
        super(HttpStatus.BAD_REQUEST, 'exceptions.shared.badRequest');
    }
}
