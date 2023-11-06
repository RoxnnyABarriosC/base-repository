import { Role } from '@modules/role/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class RoleSubscriber implements EntitySubscriberInterface<Role>
{
    private readonly logger = new Logger(RoleSubscriber.name);

    listenTo()
    {
        return Role;
    }
}
