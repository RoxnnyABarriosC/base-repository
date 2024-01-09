import { AuthService } from '@modules/auth/domain/services';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Event } from 'socket.io/dist/socket';
import { SocketAuth } from '../../domain/strategies';

export type SocketMiddleware =  (event: Event | SocketAuth | any, next: (err?: Error) => void) => void

export const WebSocketAuthMiddleware = (moduleRef: ModuleRef): SocketMiddleware =>
{
    return async(client, next) =>
    {
        try
        {
            const jwtService = moduleRef.get(JwtService, { strict: false });
            const authService = moduleRef.get(AuthService, { strict: false });

            const token = (client as SocketAuth).handshake.headers.authorization?.split(' ')[1] ?? null;
            const payload = jwtService.verify(token);

            const user = await authService.jwtAuthenticate(payload.userId);

            (client as SocketAuth).user = { payload, data: user };

            next();
        }
        catch (error)
        {
            next(error as any);
        }
    };
};
