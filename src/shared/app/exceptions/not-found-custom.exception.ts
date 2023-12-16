import { HttpStatus } from '@nestjs/common';
import { HttpException } from './http.exception';

export class NotFoundCustomException extends HttpException
{
    constructor(entity: string)
    {
        super(HttpStatus.NOT_FOUND, 'exceptions.shared.notFound', { entity });
    }
}
