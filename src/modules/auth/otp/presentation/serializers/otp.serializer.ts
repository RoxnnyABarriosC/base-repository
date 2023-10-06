import configuration from '@config/configuration';
import { SCOPE } from '@modules/auth/otp/domain/constants';
import { OTP } from '@modules/auth/otp/domain/entities';
import { OtpConfigSerializer } from '@modules/auth/otp/presentation/serializers/otp-config.serializer';
import { SerializerScope } from '@shared/abstractClass';
import { Serializer } from '@shared/utils';
import { Expose } from 'class-transformer';

const { otp, tasks } = configuration();

export class OTPSerializer extends SerializerScope(SCOPE)
{
    @Expose()
    public email: OtpConfigSerializer;

    @Expose()
    public phone: OtpConfigSerializer;

    @Expose()
    public limitAttempts = otp.limitAttempts;

    @Expose()
    public codeExpire = otp.codeExpire;

    @Expose()
    public restartingAttempts = tasks.otp.restartingAttempts;

    override async build(data: OTP): Promise<void>
    {
        super.build(data);
        this.email = (await Serializer(data.config.email, OtpConfigSerializer)) as unknown as OtpConfigSerializer;
        this.phone = (await Serializer(data.config.phone, OtpConfigSerializer)) as unknown as OtpConfigSerializer;
    }
}
