import { OTPProvidersEnum, OTPSendTypeEnum } from '@modules/securityConfig/domain/enums';

export type OTPConfigType = {
    [key in OTPSendTypeEnum]: {
        enable: boolean;
        attempts: number;
        providers?: OTPProvidersEnum[];
    }
}
