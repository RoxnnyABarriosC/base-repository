import { SocketAuth } from '@modules/auth/domain/strategies';
import { Protected } from '@modules/auth/presentation/decorators';
import { WebSocketAuthMiddleware, WebSocketI18nMiddleware } from '@modules/auth/presentation/middlewares';
import { Logger, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer } from '@nestjs/websockets';
import { WsCustomExceptionFilter } from '@shared/app/filters';
import { ThrottlerGuard } from '@shared/app/guards';
import { ValidationPipe } from '@shared/classValidator/pipes';
import { Server, Socket } from 'socket.io';
import { SayHelloDto } from '../dtos';
import { SocketEventEnum } from '../enums';


@WebSocketGateway({ namespace: 'socket'  })
@Protected('ws')
@UseFilters(new WsCustomExceptionFilter())
@UsePipes(ValidationPipe())
@UseGuards(ThrottlerGuard)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer() private readonly server: Server;
    private readonly  logger = new Logger(SocketGateway.name);

    constructor(
        private readonly moduleRef: ModuleRef
    )
    {}

    afterInit(client: Socket)
    {
        client.use(WebSocketAuthMiddleware(this.moduleRef));
        client.use(WebSocketI18nMiddleware(this.moduleRef));
    }

    async handleConnection(@ConnectedSocket() client: SocketAuth, ...args: any[])
    {
        const user = client.user.data;

        this.logger.log(`'client@${client.id}' | '${user.UserName}@${user._id}' connected`);

        client.broadcast.emit(SocketEventEnum.CONNECTED, { userId: user._id, isConnected: true, userName: user.UserName });
    }

    async handleDisconnect(@ConnectedSocket() client: SocketAuth)
    {
        const user = client.user.data;

        this.logger.log(`'client@${client.id}' | '${user.UserName}@${user._id}' disconnected`);

        client.broadcast.emit(SocketEventEnum.DISCONNECTED, { userId: user._id, isConnected: false, userName: user.UserName });
    }

    @SubscribeMessage(SocketEventEnum.SAY_HELLO)
    async sayHello(@MessageBody() dto: SayHelloDto, @ConnectedSocket() client: SocketAuth)
    {
        client.broadcast.emit(SocketEventEnum.SAY_HELLO, dto);
    }
}
