import { OTP } from '@modules/otp/domain/entities';
import { Logger } from '@nestjs/common';
import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class OTPSubscriber implements EntitySubscriberInterface<OTP>
{
    private readonly logger = new Logger(OTPSubscriber.name);

    listenTo()
    {
        return OTP;
    }
}
