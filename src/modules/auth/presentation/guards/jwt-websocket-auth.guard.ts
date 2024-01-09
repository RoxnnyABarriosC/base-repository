import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTWebsocketAuthGuard extends AuthGuard('jwt-websocket')
{}
