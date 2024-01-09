import { AuthModule } from '@modules/auth';
import { Module } from '@nestjs/common';
import { SocketGateway } from './presentation/gateways';

@Module({
    imports: [
        AuthModule
    ],
    providers: [
        SocketGateway
    ]
})
export class SocketModule
{}
