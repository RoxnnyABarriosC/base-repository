import { File } from '@modules/common/file/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';


@EventSubscriber()
export class FileSubscriber implements EntitySubscriberInterface<File>
{
    private readonly logger = new Logger(FileSubscriber.name);

    listenTo()
    {
        return File;
    }
}
