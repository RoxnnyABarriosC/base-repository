import configuration from '@config/configuration';
import { SCOPE } from '@modules/securityConfig/domain/constants';
import { SecurityConfig } from '@modules/securityConfig/domain/entities';
import { OTPConfigSerializer } from '@modules/securityConfig/presentation/serializers/otp-config.serializer';
import { SerializerScope } from '@shared/classValidator/abstractClass';
import { Serializer } from '@shared/classValidator/utils';
import { Expose } from 'class-transformer';

const { otp, tasks } = configuration();

export class SecurityConfigSerializer extends SerializerScope(SCOPE)
{
    @Expose()
    public email: OTPConfigSerializer;

    @Expose()
    public phone: OTPConfigSerializer;

    @Expose()
    public otpAttempts: number;

    @Expose()
    public requiredPassword: boolean;

    @Expose()
    public limitAttempts = otp.limitAttempts;

    @Expose()
    public restartingAttempts = tasks.otp.restartingAttempts;

    override async build(data: SecurityConfig): Promise<void>
    {
        super.build(data);
        this.email = (await Serializer(data.otp.email, OTPConfigSerializer)) as unknown as OTPConfigSerializer;
        this.phone = (await Serializer(data.otp.phone, OTPConfigSerializer)) as unknown as OTPConfigSerializer;
    }
}
