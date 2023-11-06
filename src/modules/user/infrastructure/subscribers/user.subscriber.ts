import { OTP } from '@modules/otp/domain/entities';
import { User } from '@modules/user/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';

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
        const otp  = new OTP();
        otp.User = event.entity;

        await event.manager.save(OTP, otp);
    }
}
