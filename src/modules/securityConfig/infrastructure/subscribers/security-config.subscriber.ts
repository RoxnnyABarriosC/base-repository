import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class SecurityConfigSubscriber implements EntitySubscriberInterface<SecurityConfig>
{
    private readonly logger = new Logger(SecurityConfigSubscriber.name);

    listenTo()
    {
        return SecurityConfig;
    }
}
