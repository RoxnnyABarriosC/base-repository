import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class SecurityConfigSubscriber implements EntitySubscriberInterface<SecurityConfig>
{
    private readonly logger = new Logger(SecurityConfigSubscriber.name);

    listenTo()
    {
        return SecurityConfig;
    }

    beforeUpdate(event: UpdateEvent<SecurityConfig>): Promise<any> | void
    {
        const entity = event.entity as SecurityConfig;

        if (entity instanceof SecurityConfig && !entity.otp?.email?.enable && !entity?.otp?.phone?.enable)
        {
            entity.requiredPassword = true;
        }
    }
}
