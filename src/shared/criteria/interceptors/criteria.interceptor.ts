import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class CriteriaInterceptor implements NestInterceptor
{
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>
    {
        const req: Request = context.switchToHttp().getRequest();

        if (!req.query?.filter)
        {
            req.query.filter = { };
        }

        if (!req.query?.sort)
        {
            req.query.sort = { };
        }

        if (!req.query?.pagination)
        {
            req.query.pagination = { };
        }

        return next.handle();
    }
}

