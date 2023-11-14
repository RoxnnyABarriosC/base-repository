import configuration from '@config/configuration';
import { SCOPE } from '@modules/securityConfig/domain/constants';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OtpConfigSerializer } from '@modules/securityConfig/presentation/serializers/otp-config.serializer';
import { SerializerScope } from '@shared/abstractClass';
import { Serializer } from '@shared/utils';
import { Expose } from 'class-transformer';

const { otp, tasks } = configuration();

export class SecurityConfigSerializer extends SerializerScope(SCOPE)
{
    @Expose()
    public email: OtpConfigSerializer;

    @Expose()
    public phone: OtpConfigSerializer;

    @Expose()
    public requiredPassword: boolean;

    @Expose()
    public limitAttempts = otp.limitAttempts;

    @Expose()
    public expirationTime = otp.expirationTime;

    @Expose()
    public restartingAttempts = tasks.otp.restartingAttempts;

    override async build(data: SecurityConfig): Promise<void>
    {
        super.build(data);
        this.email = (await Serializer(data.otp.email, OtpConfigSerializer)) as unknown as OtpConfigSerializer;
        this.phone = (await Serializer(data.otp.phone, OtpConfigSerializer)) as unknown as OtpConfigSerializer;
    }
}
