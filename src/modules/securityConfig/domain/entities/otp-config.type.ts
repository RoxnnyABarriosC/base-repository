import { OTPProvidersEnum, OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';

export type OTPConfigType = {
    [key in OTPSendTypeEnum]: {
        value: string;
        enable: boolean;
        expireTime: Date;
        attempts: number;
        providers?: OTPProvidersEnum[];
    }
}
