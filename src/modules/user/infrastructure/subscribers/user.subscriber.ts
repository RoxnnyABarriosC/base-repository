import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { User } from '@modules/user/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User>
{
    private readonly logger = new Logger(UserSubscriber.name);

    listenTo()
    {
        return User;
    }

    async afterInsert(event: InsertEvent<User>): Promise<void>
    {
        const otp  = new SecurityConfig();
        otp.User = event.entity;

        await event.manager.save(SecurityConfig, otp);
    }

    beforeUpdate(event: UpdateEvent<User>): Promise<any> | void
    {
        const user = event.entity as User;

        if (!user.blocked.enable)
        {
            user.blocked.blockedAt = null;
        }
    }
}
