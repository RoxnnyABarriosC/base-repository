import { User } from '@modules/auth/user/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User>
{
    private readonly logger = new Logger(UserSubscriber.name);

    listenTo()
    {
        return User;
    }
}
