import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { SocketEvent } from '@shared/app/abstractClass';
import { WSSerializer } from '@shared/classValidator/utils/ws-serializer';
import { Server } from 'socket.io';

export enum SocketEventEnum {
    SOCKET_EMIT = 'socket.emit',
}

@WebSocketGateway()
export class SocketListener
{
    private readonly logger = new Logger(SocketListener.name);

    @WebSocketServer() private readonly server: Server;

    constructor(
        private readonly configService: ConfigService
    )
    {}

    @OnEvent(SocketEventEnum.SOCKET_EMIT, { async: true })
    async emit({ messageName, body, config = { to: null, serializer: null } }: SocketEvent)
    {
        const to = config?.to;
        const serializer = config?.serializer;

        try
        {
            body = await WSSerializer(body, serializer);

            if (to)
            {
                this.server.to(to).emit(messageName, body);
            }
            else
            {
                this.server.emit(messageName, body);
            }
        }
        catch (error)
        {
            this.logger.error(error);
            throw error;
        }
    }
}
